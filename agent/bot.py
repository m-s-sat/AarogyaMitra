# %%
import os
from sympy import sympify, N
from sympy.core.sympify import SympifyError
import re
from typing import Annotated
import math
import requests
from ddgs import DDGS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool
from pydantic import BaseModel, computed_field
from typing import Annotated
from langchain_core.messages import BaseMessage
from langchain_core.messages import ToolMessage, SystemMessage
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient
from langgraph.graph.message import add_messages
from datetime import datetime
from langchain.prompts import PromptTemplate
from langchain_core.messages.utils import count_tokens_approximately
from booking import tool_doctor
from gemini_embedding import disease_data_search_from_database

# %%
def get_current_datetime_response():
    now = datetime.now()

    formatted_time = now.strftime("%A, %d %B %Y at %I:%M %p")
    response = f"The current date and time is {formatted_time}."

    return response

# %%
client = MongoClient(os.environ["MONGOURI"])
collection = client[os.getenv("DBNAME")]["bookings"]
checkpointer = MongoDBSaver(client=client,db_name=os.environ["DBNAME"])

@tool
def book_appointment(hospitals: list[str],doctors: list[str],user_id: str):
    """this tool gives the user options to select from the list of doctors and hospitals that you will give in this.
    User id must be given or else the tool will fail"""
    new = {
        "_id":user_id,
        "hospitals":hospitals,
        "doctors":doctors
    }
    
    collection.replace_one({"_id":user_id},new,upsert=True)
    return "User was given options to select from the hospitals and doctors"
    
# book_appointment.invoke(input={"name":"book_appointment","id":"jdkjfslkdd","type":"tool_call",
#                                "args":{"user_id":"sjdf","hospitals":["aims"],"doctors":["mehra"]}})

# %%
load_dotenv()

# %%

def replace_constants_in_expr(expr: str) -> str:
    # Replace 'pi' and 'e' only when they appear as standalone tokens or parts of math expressions
    replacements = {
        r'\bpi\b': str(math.pi),     # \b ensures 'pi' is a word boundary
        r'\be\b': str(math.e)
    }
    
    for pattern, value in replacements.items():
        expr = re.sub(pattern, value, expr)
    
    return expr


@tool
def evaluate_expression(expr: str) -> str:
    '''Evaluates any maths expression'''
    
    try:
        expr = replace_constants_in_expr(expr)
        # Parse the expression symbolically
        symbolic_expr = sympify(expr)
        # Evaluate to numeric value with 6 decimal precision
        result = N(symbolic_expr, 6)
        return str(result)
    except SympifyError as e:
        return f"Invalid expression: {e}"
    except Exception as e:
        return f"Error: {e}"



# %%

@tool
def search_duckduckgo(query: str):
    """search the web using DuckDuckGo"""
    with DDGS() as ddgs:
        results = ddgs.text(query,max_results=5)
        return str(results)


# %%
@tool
def search_disease_info(query: str):
    """a tool to search about a particular type of health issue or disease. It performs vector search
    to get related info. The query given to this tool must be properly made so that you get relevant and
    important information"""
    return disease_data_search_from_database(query=query)

@tool
def api_retriver(lat: Annotated[int,"latitude from the location of the user"],lon: Annotated[int,"longitude from the location of the user"],radius:Annotated[int,"radius of the circle to search from the user. Less radius means close hospitals"]):
    """get the nearest hospitals for the user using the bhuvan api,
    the radius of searching that should be tried first is 1000 and if you don't get any hospitals you should try 3000 and
    then you can if you don't get any hospital you can search in more radius"""
    access_token = os.getenv("BHUVAN_ACCESS_TOKEN")

    url = "https://bhuvan-app1.nrsc.gov.in/api/api_proximity/curl_hos_pos_prox.php"
    params = {
    "theme": "hospital",
    "lat": lat,
    "lon": lon,
    "buffer": radius,
    "token": access_token
    }
    response = requests.get(url,params=params)
    if response.status_code == 200:
        data = response.content
        if (str(data) != "b'false '"):
            return (f"hospitals found {data}") 
        else:
            return "radius is too small to search for hospitals"
    else:
        return "ERROR retriving hospitals from the internet"
# %%
tools = [evaluate_expression, search_duckduckgo,book_appointment,api_retriver,tool_doctor,search_disease_info]




# %%
llm = ChatGoogleGenerativeAI(model="gemini-2.5-falsh").bind_tools(tools=tools)

summary_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

# %%
class chat(BaseModel):
    static_system : str
    dynamic_system : str
    summary : str 
    messages : Annotated[list[BaseMessage], add_messages]
    @computed_field(return_type=BaseMessage)
    @property
    def model_in_sys(self):
        prompt = PromptTemplate.from_template("""{selfstatic_system} 
                                              {selfdynamic_system}""")
        return SystemMessage(prompt.format(selfstatic_system=self.static_system,selfdynamic_system=self.dynamic_system))
    
    @computed_field(return_type=BaseMessage)
    @property
    def model_in_summary(self):
        prompt = PromptTemplate.from_template("""Long term memory with the user:\n
                                              {summary} """)
        return SystemMessage(prompt.format(summary=self.summary))



# %%
def chat_node(chats: chat):
    input_ = [chats.model_in_sys]+[chats.model_in_summary]
    input_ = input_ + chats.messages
    response = llm.invoke(input_)
    return {"messages":[response]}

# %%
tool_dict = {tool.name : tool for tool in tools}

# %%
def tool_node(chat: chat):
    tool_calls = chat.messages[-1].tool_calls
    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        try:
            tool = tool_dict[tool_name]
            tool_response = tool.invoke(tool_call["args"])
            tool_message = ToolMessage(content=tool_response, name=tool_name, tool_call_id=tool_call["id"])
            chat.messages.append(tool_message)
        except Exception as e:
            error_message = ToolMessage(content=f"{str(e)}", name = tool_name, tool_call_id=tool_call["id"])
            chat.messages.append(error_message)
    return chat

# %%
def tool_call_condition(chats: chat):
    if chats.messages[-1].tool_calls:
        return "tools"
    return "end"

# %%

def start(chats: chat):
    return chats
    
    
def token_count(chats: chat):
    messages = chats.messages
    tokens = count_tokens_approximately(messages=(m for m in messages),chars_per_token=3,extra_tokens_per_message=60)
    if tokens > 4000:
        return "exceeded"
    else:
        return "chat"

def history(chats: chat):
    message = chats.messages[0]
    summary = chats.model_in_summary
    
    prompt = "Summarize the above messages. Summary must to be to the point and should be under 200 words"
    command = SystemMessage(prompt)
    model_in = [message]+[summary]+[command]
    
    result = summary_llm.invoke(input=model_in)
    
    chats.summary = result.content
    chats.messages = chats.messages[1:]
    
    return chats

# %%
builder = StateGraph(chat)

builder.add_node("start",start)
builder.add_node("chat_node",chat_node)
builder.add_node("tools",tool_node)
builder.add_node("history",history)
builder.add_edge(START,"start")
builder.add_conditional_edges(
    "start",
    token_count,
    {
        "exceeded":"history",
        "chat":"chat_node"
    }
)
builder.add_edge("history","start")
builder.add_conditional_edges("chat_node"
                              , tool_call_condition,
                              {
                                  "tools":"tools",
                                  "end": END
                              }
                              )
builder.add_edge("tools", "chat_node")

graph = builder.compile(checkpointer=checkpointer)


# %%
# graph

# %%
# user = input("You: ")
# while user.lower() not in ["q", "quit", "exit"]:
#     llm_input = HumanMessage(content=user)
#     state = chat(messages=[llm_input],
#                  static_system=static_sys,
#                  dynamic_system=dynamic_sys,
#                  summary=""
#                  )
#     print("AI: ")
#     for chunk, meta in graph.stream(input=state,
#                                 config={"configurable": {"thread_id": "final_test"}},
#                                 stream_mode="messages"
#                                 ):
#         if chunk.content and meta["langgraph_node"] == "chat_node":
#             print(chunk.content,flush=True,sep="||")
#     print("\n")
#     user = input("You: ")

# # %%
# config={"configurable": {"thread_id": "final_test"}}
# check = checkpointer.get(config=config)

# # %%
# check.keys()
# # %%
# check["channel_values"]["messages"]
# # %%
