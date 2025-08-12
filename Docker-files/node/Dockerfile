FROM node:current-alpine3.22 AS frontend
WORKDIR /app
RUN apk add --no-cache git
COPY . .
RUN npm install && npm run build

FROM node:current-alpine3.22 AS backend
WORKDIR /app
COPY ./Backend ./Backend
COPY --from=frontend /app/dist ./Backend/dist
WORKDIR /app/Backend
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]

FROM python:3.11-slim AS agent
WORKDIR /app
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
COPY ./agent_api ./agent_api
WORKDIR /app/agent_api
RUN pip install --no-cache-dir -r requirements.txt
