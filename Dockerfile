#Creating image
FROM ubuntu:18.04
#Creating Build arguments for Docker container
ARG PORT=3000
#Installing latest dependencies
RUN  apt-get update && apt-get -y upgrade && apt-get install -y apt-utils gcc make git libffi-dev wget
RUN apt-get install nodejs npm -y
RUN npm i -g yarn
RUN npm i -g serve
# Certificates - for repo.lucera.com - Jenkins should copy this certificate into place from Nginx
ADD ./nginx.crt /usr/local/share/ca-certificates/mycert.crt
RUN update-ca-certificates

#creating working directory on image
WORKDIR /app
#copying all contents from src into working directory
COPY . /app
#running yarn commands for proper install and build of app
RUN yarn install
RUN yarn build
EXPOSE $PORT
#creating entry point for app to instaniate on docker image
ENTRYPOINT serve -s build -l $PORT