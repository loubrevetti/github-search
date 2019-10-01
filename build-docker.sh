#!/bin/bash

# TODO - inline into the build.gradle
#=======================================================================================
# Configuration
#=======================================================================================
IMAGE_NAME="git-repo-search"
URL_REPO="repo.lucera.com"
VERSION="dev"
PORT="3000"

#=======================================================================================
# Functions
#=======================================================================================
function usage() {
    echo "build.sh [-b -u -t <tag>]"
    echo "-b            will build a docker image (called: ${IMAGE_NAME})"
    echo "-u            will upload the docker image (to: ${URL_REPO})"
    echo "-t            will tag image to value of -v version (default ${VERSION})"
    echo "-v <version>  will set the tag name "
    echo "-p <exposed-port> will porgrammatically set the which port to expose"
    exit 1
}

function dockerBuild() {
    echo "Building"
    docker build -t $IMAGE_NAME:latest --build-arg PORT=${PORT} .
    test $? -ne 0 && { echo "Build Failed"; exit 1; }
}

function dockerTagIt() {
    echo "Tagging ${IMAGE_NAME} as ${VERSION}"
    docker tag ${IMAGE_NAME} $URL_REPO/${IMAGE_NAME}:${VERSION}
    test $? -ne 0 && { echo "Tagging Failed"; exit 1; }
}

function dockerUpload() {
    echo "Uploading ${VERSION}"
    docker push $URL_REPO/${IMAGE_NAME}:${VERSION}
    test $? -ne 0 && { echo "Upload Failed"; exit 1; }
}

#=======================================================================================
# Main
#=======================================================================================

# Check dependancies
command -v docker >/dev/null 2>&1 || { echo "docker is not installed"; exit 1; }

build=false
tagit=false
upload=false

# Process arguments
while getopts "hbutv:p:" opt
do
    case ${opt} in
        v)
            VERSION=$OPTARG
            ;;
        p)
            PORT=$OPTARG
            ;;
        h)
            usage
            ;;
        t)
            tagit=true
            ;;
        b)
            build=true
            ;;
        u)
            upload=true
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            exit 1
            ;;
        :)
            echo "-$OPTARG requires argument"
            ;;
    esac
done


test "$build" == true && { dockerBuild; }
test "$tagit" == true && { dockerTagIt; }
test "$upload" == true && { dockerUpload; }
exit 0