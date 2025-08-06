from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bot import graph,chat,get_current_datetime_response
from langchain_core.messages import HumanMessage
import asyncio

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Common port for Vite React apps
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_sys = """You are a healthcare assistant. Respond to any query of the patient related to health and diseases"""
dynamic_sys= get_current_datetime_response()


async def stream_chat(message,id):
    input_ = message
    id_ = id
    
    global static_sys
    global dynamic_sys
    state = chat(static_system=static_sys,
                 dynamic_system=dynamic_sys,
                 u1="",
                 summary="",
                 messages=[HumanMessage(input_)])
    async for chunk, meta in graph.astream(input=state,
                                config={"configurable": {"thread_id": id_}},
                                stream_mode="messages"
                                ):
        if chunk.content and meta["langgraph_node"] == "chat_node":
            yield f"data: {chunk.content}\n\n"

class request_(BaseModel):
    message: str
    id: str
    
@app.post("/chat_message")
def stream(request: request_):
    message = request.message
    id = request.id
    
    return StreamingResponse(stream_chat(message,id),media_type="text/event-stream")
    