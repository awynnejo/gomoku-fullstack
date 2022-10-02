FROM node:latest

ENV DBURI="mongodb+srv://admin:UWmrfI0J0KC60oka@cluster0.u9dj7ek.mongodb.net/?retryWrites=true&w=majority"

ENV PORT=8000

#RUN npm install http-server

RUN npm http-server ./frontend/dist
