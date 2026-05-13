from typing_extensions import TypedDict
from langgraph.graph import StateGraph, END

from app.services.groq_service import extract_interaction_data


# State structure
class AgentState(TypedDict):
    user_message: str
    extracted_data: dict
    summary: str
    sentiment: str
    follow_up: str


# Node 1 - Extract interaction data
def extract_node(state: AgentState):

    data = extract_interaction_data(state["user_message"])

    return {
        "extracted_data": data
    }


# Node 2 - Generate summary
def summary_node(state: AgentState):

    summary = state["extracted_data"].get("summary", "")

    return {
        "summary": summary
    }


# Node 3 - Analyze sentiment
def sentiment_node(state: AgentState):

    sentiment = state["extracted_data"].get("sentiment", "")

    return {
        "sentiment": sentiment
    }


# Node 4 - Follow-up recommendation
def followup_node(state: AgentState):

    follow_up = state["extracted_data"].get("follow_up", "")

    return {
        "follow_up": follow_up
    }


# Build graph
graph = StateGraph(AgentState)

graph.add_node("extract", extract_node)
graph.add_node("summary", summary_node)
graph.add_node("sentiment", sentiment_node)
graph.add_node("followup", followup_node)

graph.set_entry_point("extract")

graph.add_edge("extract", "summary")
graph.add_edge("summary", "sentiment")
graph.add_edge("sentiment", "followup")
graph.add_edge("followup", END)

crm_graph = graph.compile()