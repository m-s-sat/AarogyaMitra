# %%
from sympy import sympify, N
from sympy.core.sympify import SympifyError
import re
import math
from ddgs import DDGS
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langchain.tools import tool
from pydantic import BaseModel, computed_field
from typing import Annotated, Optional
from langchain_core.messages import BaseMessage
from langchain_core.messages import ToolMessage, HumanMessage, SystemMessage, AIMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.message import add_messages
from datetime import datetime
from langchain.prompts import PromptTemplate

# %%
def get_current_datetime_response():
    now = datetime.now()

    formatted_time = now.strftime("%A, %d %B %Y at %I:%M %p")
    response = f"The current date and time is {formatted_time}."

    return response


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
tools = [evaluate_expression, search_duckduckgo]

# %%
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
).bind_tools(tools=tools)

summary_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)






# %%
date_time = get_current_datetime_response()

static_sys = """you are a helpful assistant that can explain and solve the user query """

dynamic_sys =    f"""{date_time}"""






# %%
class chat(BaseModel):
    static_system : str
    dynamic_system : str
    u1 : str
    summary : str | None
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
        prompt = PromptTemplate.from_template("""{summary} """)
        return SystemMessage(prompt.format(summary=self.summary))


# %%
# def summarizer(chats: chat):
#     sys = chats.model_in_sys
#     summary = chats.model_in_summary
#     final_messages = chats.messages

#     while count_tokens_approximately(
#         messages=[sys]+[summary]+final_messages,
#         chars_per_token=2.5,
#         extra_tokens_per_message=60
#     ) > 300:
        
        
#         to_summarize = final_messages[:2]
#         text = "\n\n".join(f"{type(m).__name__}: {m.content}" for m in to_summarize)

#         if summary is not None:
#             prompt = PromptTemplate.from_template(
#                 """PREVIOUS SUMMARY:\n{summarycontent}\n
#                 CONVERSATION TO SUMMARIZE:\n{text}\n
#                 Please update the summary. Keep it under 1000 tokens, concise and focused."""
#             )
#             prompt=prompt.format(summarycontent=summary.content,text=text)
#         else:
#             prompt = PromptTemplate.from_template(
#                 """CONVERSATION TO SUMMARIZE:\n{text}\n
#                 Please create a summary under 1000 tokens, concise and focused."""
#             )
#             prompt=prompt.format(text=text)

#         summary = llm.invoke(SystemMessage(content=prompt))
#         final_messages = final_messages[2:]
#     chats.messages = final_messages
#     chats.summary = summary.content
#     return {"summary":summary.content,
#             "messages":final_messages}


# def summarize_condition(chats: chat):
#     sys = chats.model_in_sys
#     summary = chats.model_in_summary
#     final_messages = chats.messages

#     if count_tokens_approximately(
#         messages=[sys]+final_messages,
#         chars_per_token=2.5,
#         extra_tokens_per_message=60
#     ) > 100:
#         return "summarize"
#     return "chat"

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

def history(chats: chat):
    messages = chats.messages
    if chats.messages.__len__() > 10:
        chats.messages = messages[-10:]
    return chats

# %%
builder = StateGraph(chat)

builder.add_node("chat_node",chat_node)
builder.add_node("tools",tool_node)
builder.add_node("history",history)
# builder.add_node("summary",summarizer)
# builder.add_edge(START,"summary")
# builder.add_edge("summary", "chat_node")
builder.add_edge(START,"history")
builder.add_edge("history","chat_node")
builder.add_conditional_edges("chat_node"
                              , tool_call_condition,
                              {
                                  "tools":"tools",
                                  "end": END
                              }
                              )
builder.add_edge("tools", "chat_node")

checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)

# %%
# user = input("You: ")
# while user.lower() not in ["q", "quit", "exit"]:
#     llm_input = HumanMessage(content=user)
#     state = chat(messages=[llm_input],
#                  static_system=static_sys,
#                  dynamic_system=dynamic_sys,
#                  u1="",
#                  summary=""
#                  )
#     print("AI: ")
#     for chunk, meta in graph.stream(input=state,
#                                 config={"configurable": {"thread_id": 1}},
#                                 stream_mode="messages"
#                                 ):
#         if chunk.content and meta["langgraph_node"] == "chat_node":
#             print(chunk.content,flush=True,sep="|")
#     print("\n")
#     user = input("You: ")
    
