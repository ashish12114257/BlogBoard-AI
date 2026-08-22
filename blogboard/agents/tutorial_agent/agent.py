import json
import re
import math

from blogboard.graph.state import BlogState
from blogboard.services.llm import LLMAgentService
from blogboard.services.storage import R2StorageService
from blogboard.config.settings import app_settings
from blogboard.services.prompt_manager import prompt_manager
from .prompts import TUTORIAL_TOPIC_PROMPT, TUTORIAL_GENERATION_PROMPT


def _read_time(text: str) -> str:
    WORDS_PER_MINUTE = 200
    return f"{math.ceil(len(text.split()) / WORDS_PER_MINUTE)} min"


def tutorial_node(state: BlogState) -> BlogState:
    print("  => [TutorialAgent] Running...")

    # ---------------------------------------------------------
    # Step 1: Get topic and subtopics
    # ---------------------------------------------------------
    topic = state.get("topic")
    subtopics = state.get("subtopics", "")

    # ---------------------------------------------------------
    # R2 is ONLY required when the agent has to autonomously
    # select a topic. For the React "Generate with AI" flow,
    # the user already provides the topic, so R2 is not needed.
    # ---------------------------------------------------------
    if not topic:
        storage = R2StorageService()

        domain_dates = storage.get_all_domains_last_updated()

        # Filter out AI News
        valid_domains = {
            k: v for k, v in domain_dates.items()
            if k != "ainews"
        }

        sorted_domains = sorted(
            valid_domains.items(),
            key=lambda item: item[1]
        )

        target_domain = sorted_domains[0][0]

        tags_config = app_settings.tags.model_dump()

        cat_label = tags_config.get(
            target_domain,
            {}
        ).get(
            "label",
            target_domain
        )

        print(
            f"  [AGENT] Autonomously selected domain: "
            f"{target_domain}"
        )

        recent_history = storage.get_recent_history(
            target_domain,
            limit=3
        )

        history_str = "No recent history found."

        if recent_history:
            history_str = "\n---\n".join([
                f"Title: {item['title']}\n"
                f"Topic: {item['topic']}\n"
                f"Subtopics: {item['subtopics']}"
                for item in recent_history
            ])

        topic_prompt = prompt_manager.get_prompt(
            "Tutorial_Topic_Prompt",
            TUTORIAL_TOPIC_PROMPT,
            cat_label=cat_label,
            history=history_str
        )

        llm_service = LLMAgentService(
            temperature=0.8
        )

        res = llm_service.llm.invoke(
            topic_prompt
        )

        raw = res.content.strip()

        raw = re.sub(
            r"^```json\s*",
            "",
            raw,
            flags=re.MULTILINE
        )

        raw = re.sub(
            r"```\s*$",
            "",
            raw,
            flags=re.MULTILINE
        )

        try:
            topic_data = json.loads(
                raw.strip()
            )

            topic = topic_data.get(
                "topic",
                "Advanced Concepts"
            )

            subtopics = topic_data.get(
                "subtopics",
                ""
            )

        except json.JSONDecodeError:
            topic = (
                "Emerging Trends in "
                + cat_label
            )

            subtopics = ""

        print(
            f"  [AGENT] Picked Topic: {topic}"
        )

    else:
        # -----------------------------------------------------
        # Topic was supplied by the user.
        # No R2 access is required.
        # -----------------------------------------------------
        target_domain = state.get(
            "domain",
            "ml"
        )

        tags_config = app_settings.tags.model_dump()

        cat_label = tags_config.get(
            target_domain,
            {}
        ).get(
            "label",
            target_domain
        )

        print(
            f"  [AGENT] Topic already defined: {topic}"
        )

    # ---------------------------------------------------------
    # Step 2: Dry run
    # ---------------------------------------------------------
    if state.get("dry_run"):
        print(
            "  [DRY RUN] Skipping LLM Generation."
        )

        return {
            **state,
            "domain": target_domain,
            "topic": topic,
            "subtopics": subtopics,
            "content": (
                f"# {topic}\n\n"
                "Dry run tutorial text."
            ),
            "read_time": "1 min"
        }

    # ---------------------------------------------------------
    # Step 3: Validator feedback
    # ---------------------------------------------------------
    validator_feedback = ""

    if state.get("validator_feedback"):
        validator_feedback = (
            "CRITICAL FEEDBACK FROM PREVIOUS DRAFT. "
            "You must fix these issues:\n"
            f"{state.get('validator_feedback')}"
        )

    # ---------------------------------------------------------
    # Step 4: Generate blog content using existing LLM service
    # ---------------------------------------------------------
    generation_prompt = prompt_manager.get_prompt(
        prompt_name="Tutorial_Generation_Prompt",
        fallback_prompt=TUTORIAL_GENERATION_PROMPT,
        cat_label=cat_label,
        topic=topic,
        subtopics=subtopics,
        validator_feedback=validator_feedback
    )

    llm_service_gen = LLMAgentService(
        temperature=0.6
    )

    res_gen = llm_service_gen.llm.invoke(
        generation_prompt
    )

    content = res_gen.content.strip()

    rt = _read_time(content)

    print(
        f"  [AGENT] Generated "
        f"{len(content.split())} words. "
        f"Read time: {rt}"
    )

    # ---------------------------------------------------------
    # Step 5: Return generated content to ValidatorAgent
    # ---------------------------------------------------------
    return {
        **state,
        "domain": target_domain,
        "topic": topic,
        "subtopics": subtopics,
        "content": content,
        "read_time": rt
    }