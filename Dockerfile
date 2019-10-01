FROM nginx:1.12-alpine
ARG PORT=80
COPY build /usr/share/nginx/html
RUN echo "Running server on port $PORT"
EXPOSE $PORT
CMD ["nginx", "-g", "daemon off;"]
