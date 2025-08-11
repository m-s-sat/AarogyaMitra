
# %%
from typing import Annotated
import requests
from pydantic import BaseModel, Field
from langchain.tools import StructuredTool
from dotenv import load_dotenv
import os
# from neo4j_tool import neo4j_retriever

load_dotenv()
# %%

class api_schema(BaseModel):
    hospital_search_radius : int = Field(description="""
                                            "Hospitals for the user will be searched based on the given radius"
                                            distance from the user to search for the hospital, if the user needs a 
                                            doctor very urgently or fast the distance can be less and if the user's case
                                            is not very urgent it can be more. Also if the hospitals are not available 
                                            in a less radius you should search for even greater radius""")
    lat:float = Field(description="latitude of the location of the user")
    lon: float = Field(description="longitude of the location of the user")
    
class disease_info(BaseModel):
    doctor_field: str = Field(description="type of doctor required by patient like Neurologist,ENT,Dentist etc.")
    hospital_names: list[str] = Field(description="hospitals to search for the user")

    
tools = []

# # %%  
# def get_info(state: book_state):
    
#     agent = booking_agent.with_structured_output(disease_info)
#     prompt = """
#     Here are some messages between a medical assistant and a human. You are required to provide disease information 
#     perfectly in the format specified.
#     """
#     config={"configurable": {"thread_id": state.patient_id}}
#     check = checkpointer.get(config=config)
#     messages = check["channel_values"]["messages"]
#     task = SystemMessage(prompt)
#     model_in = [task] + messages
#     disease_information = agent.invoke(model_in)
#     return disease_information.model_dump_json()

# %%
def api_retriver(lat: Annotated[int,"latitude from the location of the user"],lon: Annotated[int,"longitude from the location of the user"],radius:Annotated[int,"radius of the circle to search from the user. Less radius means close hospitals"]):
    """get the nearest hospitals for the user using the bhuvan api,
    the radius of searching that should be tried first is 1000 and if you don't get any hospitals you should try 3000"""
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
# api_retriver(lat=16.27939453125,lon=80.58837890625,radius=3000)

# %%


def get_doctors_information(doctor_field: str,hospital_names: list[str]):
    query = f"""
    find the doctors according to following given information
    doctor_field:{doctor_field},
    hospitals to search for -- {hospital_names}
    """
    # result = neo4j_retriever(query=query) #get name of the doctor and its time slot from the database
    # result = get_doctors_info(query=query)
    result = "Dr. Mehra , time slots: Morning 9 am to 12 am and evening 4 pm to 7 pm"
    return result

# %%
tool_doctor = StructuredTool.from_function(
    func=get_doctors_information,
    name="get_doctors_information",
    description="a tool that can be used to find out the relevent doctors to visit if you know the hospitals",
    args_schema=disease_info
)


    
    
    
    
    
    
    
    


    

