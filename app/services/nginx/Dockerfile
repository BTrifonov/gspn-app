FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app /app
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 7000

CMD ["nginx", "-g", "daemon off;"]