from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import InteractionCreate
from app.database import SessionLocal
from app import models
from app.services.groq_service import extract_interaction_data
from app.langgraph_agent.agent import crm_graph

router = APIRouter()


# DATABASE SESSION

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE INTERACTION

@router.post("/log-interaction")
def log_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):

    new_interaction = models.Interaction(

        # BASIC DETAILS

        hcp_name=interaction.hcp_name,

        interaction_type=interaction.interaction_type,

        interaction_date=interaction.interaction_date,

        interaction_time=interaction.interaction_time,

        attendees=interaction.attendees,

        # DISCUSSION

        topics_discussed=interaction.topics_discussed,

        materials_shared=interaction.materials_shared,

        samples_distributed=interaction.samples_distributed,

        outcomes=interaction.outcomes,

        # AI + SENTIMENT

        sentiment=interaction.sentiment,

        summary=interaction.summary,

        follow_up=interaction.follow_up,

        ai_suggested_followup=interaction.ai_suggested_followup
    )

    db.add(new_interaction)

    db.commit()

    db.refresh(new_interaction)

    return {
        "message": "Interaction saved successfully",
        "data": new_interaction
    }

# GET ALL INTERACTIONS

@router.get("/interactions")
def get_interactions(
    db: Session = Depends(get_db)
):

    interactions = db.query(
        models.Interaction
    ).all()

    return interactions


# EDIT INTERACTION

@router.put("/edit-interaction/{interaction_id}")
def edit_interaction(
    interaction_id: int,
    updated_data: InteractionCreate,
    db: Session = Depends(get_db)
):

    interaction = db.query(
        models.Interaction
    ).filter(
        models.Interaction.id == interaction_id
    ).first()

    if not interaction:

        return {
            "error": "Interaction not found"
        }

    # BASIC DETAILS

    interaction.hcp_name = updated_data.hcp_name

    interaction.interaction_type = updated_data.interaction_type

    interaction.interaction_date = updated_data.interaction_date

    interaction.interaction_time = updated_data.interaction_time

    interaction.attendees = updated_data.attendees

    # DISCUSSION

    interaction.topics_discussed = updated_data.topics_discussed

    interaction.materials_shared = updated_data.materials_shared

    interaction.samples_distributed = updated_data.samples_distributed

    interaction.outcomes = updated_data.outcomes

    # AI + SENTIMENT

    interaction.sentiment = updated_data.sentiment

    interaction.summary = updated_data.summary

    interaction.follow_up = updated_data.follow_up

    interaction.ai_suggested_followup = updated_data.ai_suggested_followup

    db.commit()

    db.refresh(interaction)

    return {
        "message": "Interaction updated successfully",
        "data": interaction
    }


# DELETE INTERACTION

@router.delete("/delete-interaction/{interaction_id}")
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db)
):

    interaction = db.query(
        models.Interaction
    ).filter(
        models.Interaction.id == interaction_id
    ).first()

    if not interaction:

        return {
            "error": "Interaction not found"
        }

    db.delete(interaction)

    db.commit()

    return {
        "message": "Interaction deleted successfully"
    }


# AI EXTRACTION

@router.post("/ai-log-interaction")
def ai_log_interaction(
    payload: dict
):

    user_message = payload.get("message")

    extracted_data = extract_interaction_data(
        user_message
    )

    return {
        "message": "AI extracted interaction successfully",
        "data": extracted_data
    }


# LANGGRAPH WORKFLOW

@router.post("/langgraph-interaction")
def langgraph_interaction(
    payload: dict
):

    user_message = payload.get("message")

    result = crm_graph.invoke({
        "user_message": user_message
    })

    return {
        "message": "LangGraph workflow executed successfully",
        "result": result
    }