from pydantic import BaseModel


class InteractionCreate(BaseModel):

    # BASIC DETAILS

    hcp_name: str

    interaction_type: str

    interaction_date: str

    interaction_time: str

    attendees: str

    # DISCUSSION

    topics_discussed: str

    materials_shared: str

    samples_distributed: str

    outcomes: str

    # AI + SENTIMENT

    sentiment: str

    summary: str

    follow_up: str

    ai_suggested_followup: str


class InteractionResponse(InteractionCreate):

    id: int

    class Config:

        from_attributes = True