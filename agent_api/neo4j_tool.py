from langchain_neo4j import Neo4jGraph, GraphCypherQAChain
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.tools import tool

url = ""
username= ""
password = ""

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash"
)

graph_neo4j = Neo4jGraph(
    url=url,
    username=username,
    password="",
    enhanced_schema=True
)

chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph_neo4j,
    verbose=False,
    validate_cypher=True,
    allow_dangerous_requests=True     
)
    

@tool
def neo4j_retriever(query: str):
    global chain
    
    result = chain.invoke({"query" : query})
    final = result["result"]
    return result

