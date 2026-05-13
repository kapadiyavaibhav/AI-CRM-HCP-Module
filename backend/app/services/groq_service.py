import os
import json

from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    api_key=groq_api_key,
    model="llama-3.3-70b-versatile"
)


def extract_interaction_data(user_message):

    prompt = f"""
    Extract structured CRM interaction information from the conversation below.

    Return ONLY valid JSON.

    Do not include markdown.
    Do not include explanation.
    Do not write ```json.

    Required JSON format:

    {{
        "hcp_name": "",
        "interaction_type": "",
        "interaction_date": "",
        "interaction_time": "",
        "attendees": "",
        "topics_discussed": "",
        "materials_shared": "",
        "samples_distributed": "",
        "outcomes": "",
        "sentiment": "",
        "summary": "",
        "follow_up": "",
        "ai_suggested_followup": ""
    }}

    Extraction Guidelines:

    - hcp_name:
      Name of the healthcare professional.

    - interaction_type:
      Examples:
      Hospital visit,
      Clinic visit,
      Product demo,
      Follow-up meeting,
      Stakeholder discussion.

    - date:
    Extract meeting date if mentioned.

    - time:
    Extract meeting time if mentioned.

    If date is mentioned, convert it into YYYY-MM-DD format.

    If time is mentioned, return it in HH:MM format.

    Generate realistic attendees, outcomes, summary, follow_up, and ai_suggested_followup based on the interaction context.

    Materials shared and samples distributed should be extracted separately if mentioned.

    - attendees:
    Mention additional attendees, procurement staff,
    department teams, or stakeholders.

    - topics_discussed:
      Key medical/commercial topics discussed.

    - materials_shared:
      Mention brochures, presentations, clinical reports,
      pricing sheets, or documents shared.

    - samples_distributed:
      Mention product samples or trial kits provided.

    - outcomes:
      Describe the business outcome/result of the interaction.

    - sentiment:
      Return only:
      Positive,
      Neutral,
      or Negative.

    - summary:
      Provide a detailed professional summary of the interaction.

    - follow_up:
      Mention the agreed next action or follow-up plan.

    - ai_suggested_followup:
      Provide an intelligent AI recommendation for the sales team.

    Conversation:
    {user_message}
    """

    response = llm.invoke(prompt)

    content = response.content.strip()

    # Remove markdown if present
    content = content.replace("```json", "")
    content = content.replace("```", "")

    return json.loads(content)