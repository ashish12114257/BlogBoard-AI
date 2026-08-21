"""
CLI entry point used by the Spring Boot backend to trigger the existing
BlogBoard LangGraph workflow and receive the generated draft as JSON.

This script intentionally does NOT persist anything: it runs the compiled
graph (TutorialAgent -> ValidatorAgent revision loop) with skip_storage=True
and prints a single JSON object to stdout. All agent log output is redirected
to stderr so the JSON payload stays parseable.

Usage:
    python blogboard/generate.py --topic "Java Multithreading" [--domain ml] [--date 2026-08-20]
"""

import argparse
import contextlib
import json
import os
import sys
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
ROOT_DIR = BACKEND_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=ROOT_DIR / ".env")
except ImportError:
    pass


def _fail(message: str) -> None:
    print(json.dumps({"error": message}), flush=True)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="BlogBoard AI draft generator (invoked by the Spring Boot backend)."
    )
    parser.add_argument("--topic", required=True, help="Blog topic to generate")
    parser.add_argument("--domain", default="ml", help="Category slug/domain (default: ml)")
    parser.add_argument("--date", default=None, help="Publish date YYYY-MM-DD (default: today IST)")
    args = parser.parse_args()

    if not args.topic.strip():
        _fail("Topic is required.")

    from blogboard.config.settings import app_settings

    api_key = (
        os.getenv("llm__api_key")
        or os.getenv("GROQ_API_KEY")
        or os.getenv("api_key")
        or (app_settings.llm.API_KEY or "")
    )
    if not api_key:
        _fail(
            "GROQ API key is not configured. Add 'llm__api_key=<key>' (or GROQ_API_KEY) "
            "to the .env file at the project root, then restart the backend."
        )
    if not app_settings.llm.API_KEY:
        app_settings.llm.API_KEY = api_key

    from blogboard.graph.graph import graph

    date_str = args.date or datetime.now(timezone(timedelta(hours=5, minutes=30))).strftime("%Y-%m-%d")

    initial_state = {
        "topic": args.topic.strip(),
        "domain": args.domain.strip() or "ml",
        "date": date_str,
        "dry_run": False,
        "skip_storage": True,
    }
    config = {"configurable": {"thread_id": f"generate-{uuid.uuid4().hex}"}}

    # Send the agent log output to stderr so stdout stays a pure JSON payload.
    with contextlib.redirect_stdout(sys.stderr):
        final_state = graph.invoke(initial_state, config=config)

    category = final_state.get("domain") or args.domain or "ml"
    result = {
        "topic": final_state.get("topic") or args.topic.strip(),
        "title": final_state.get("title") or "",
        "description": final_state.get("description") or "",
        "content": final_state.get("content") or "",
        "category": category,
        "tags": final_state.get("tags") or [category],
        "slug": final_state.get("slug") or "",
        "readTime": final_state.get("read_time") or "",
        "revisionCount": final_state.get("revision_count", 0),
    }
    print(json.dumps(result), flush=True)


if __name__ == "__main__":
    main()