FROM python:3.11-buster as build-stage

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt
 
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./ .
VOLUME [ "/app" ]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7000"]

#FROM nginx as production-stage
#RUN mkdir /app
#COPY --from=build-stage /app /app
#COPY nginx.conf /etc/nginx/nginx.conf

#EXPOSE 7000

#CMD ["nginx", "-g", "daemon off;"]


