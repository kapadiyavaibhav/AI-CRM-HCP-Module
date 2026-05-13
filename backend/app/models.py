from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Interaction(Base):

    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)

    # BASIC DETAILS

    hcp_name = Column(String(255))

    interaction_type = Column(String(255))

    interaction_date = Column(String(100))

    interaction_time = Column(String(100))

    attendees = Column(Text)

    # DISCUSSION

    topics_discussed = Column(Text)

    materials_shared = Column(Text)

    samples_distributed = Column(Text)

    outcomes = Column(Text)

    # AI + SENTIMENT

    sentiment = Column(String(100))

    summary = Column(Text)

    follow_up = Column(Text)

    ai_suggested_followup = Column(Text)