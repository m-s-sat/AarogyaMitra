FROM node:current-alpine3.22 AS frontend
WORKDIR /app
RUN apk add --no-cache git
RUN git clone https://github.com/m-s-sat/MediMitra.git
WORKDIR /app/MediMitra
RUN npm install && npm run build

FROM node:current-alpine3.22 AS backend
WORKDIR /app
COPY --from=frontend /app/MediMitra/dist ./MediMitra/Backend/dist
WORKDIR /app/MediMitra/Backend
RUN npm install

EXPOSE 5000
CMD ["npm", "start"]
