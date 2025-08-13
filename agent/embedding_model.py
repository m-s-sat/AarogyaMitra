from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
import os
from dotenv import load_dotenv
load_dotenv()

# embedding_model = HuggingFaceEmbeddings(
#     model_name="BAAI/bge-base-en-v1.5",
#     cache_folder="D:\ML\healthcare_agent",
#     show_progress=False
# )



MONGODB_ATLAS_CLUSTER_URI = os.environ["MONGOURI"]
client = MongoClient(MONGODB_ATLAS_CLUSTER_URI)

DB_NAME = "test"
COLLECTION_NAME = "vectorsearches"
ATLAS_VECTOR_SEARCH_INDEX_NAME = "vector_index"

MONGODB_COLLECTION = client[DB_NAME][COLLECTION_NAME]

# vector_store = MongoDBAtlasVectorSearch(
#     collection=MONGODB_COLLECTION,
#     embedding=embedding_model,
#     index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
#     relevance_score_fn="cosine",
# )
# retriver = vector_store.as_retriever(
#         search_kwargs={'k': 2}
# )


def disease_data_search_from_database(query: str):
    # results = retriver.invoke(query)
    # out = "\n".join(result.page_content for result in results)
    return """Abdominal aortic aneurysm
About abdominal aortic aneurysms
Symptoms of an abdominal aortic aneurysm
Causes of an abdominal aortic aneurysm
Diagnosing an abdominal aortic aneurysm
Treating an abdominal aortic aneurysm
Preventing an abdominal aortic aneurysm
About abdominal aortic aneurysms
An abdominal aortic aneurysm (AAA) is a swelling (aneurysm) of the aorta â€“ the main blood vessel that leads away from the heart, down through the abdomen to the rest of the body.
The abdominal aorta is the largest blood vessel in the body and is usually around 2cm wide â€“ roughly the width of a garden hose. However, it can swell to over 5.5cm â€“ what doctors class as a large AAA.
Large aneurysms are rare, but can be very serious. If a large aneurysm bursts, it causes huge internal bleeding and is usually fatal.
The bulging occurs when the wall of the aorta weakens. Although what causes this weakness is unclear, smoking and high blood pressure are thought to increase the risk of an aneurysm.
AAAs are most common in men aged over 65. A rupture accounts for more than 1 in 50 of all deaths in this group.
This is why all men are invited for a screening test when they turn 65. The test involves a simple ultrasound scan, which takes around 10-15 minutes.
Symptoms of an AAA
In most cases, an AAA causes no noticeable symptoms. However, if it becomes large, some people may develop a pain or a pulsating feeling in their abdomen (tummy) or persistent back pain.
An AAA doesnâ€™t usually pose a serious threat to health, but thereâ€™s a risk that a 
"""

    
    

