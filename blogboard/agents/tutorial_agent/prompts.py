TUTORIAL_TOPIC_PROMPT = """

You are an expert content strategist for a technical blog.

Domain: {cat_label}

Recent History of articles published in this domain:

{history}

Select one useful and interesting technical topic that has not been recently covered.

Return ONLY valid JSON:

{{
  "topic": "The topic name",
  "subtopics": "3 concise subtopics separated by commas"
}}

"""


TUTORIAL_GENERATION_PROMPT = """

You are a skilled technical writer.

Domain/Category: {cat_label}

Topic: {topic}

Subtopics: {subtopics}

{validator_feedback}

Write a high-quality technical blog post in Markdown.

STRICT REQUIREMENTS:
- Keep the blog between 500 and 700 words.
- Be concise and practical.
- Use clear Markdown headings.
- Use short paragraphs.
- Include examples only when they add real value.
- Avoid unnecessary repetition.
- Do not write a long introduction.
- Do not write a long conclusion.
- Do not wrap the entire response in a Markdown code block.
- Return ONLY the blog content.
"""