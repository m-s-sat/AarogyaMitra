FROM python:3.11-slim AS agent
WORKDIR /app
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
RUN git clone https://github.com/m-s-sat/MediMitra.git
WORKDIR /app/MediMitra/agent_api
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn","api:app", "--host", "0.0.0.0", "--port", "8000"]
