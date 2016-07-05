# Hostview Upload

Hostview Upload is a very simple [Sails](http://sailsjs.org) application that receives the raw data file uploads from the Hostview clients and stores the data on the local hard-drive.

## Contents

    Dockerfile	The app Docker image.
    dev.yml		Docker Compose config for development.
    prod.yml	Docker Compose config for production.
    README.md	This file.
    LICENSE		Source license (MIT).
    app/		The app source code.


## Deployment

The dev and prod deployments are managed as [Docker](https://www.docker.com/) containers. To build the app Docker image, do:

    docker build -t hostview/upload .

You should prepare a new build everytime you update node dependencies in the application's package.json, and when you modify the code (unless you have mounted the application folder on the host).

Docker volume sharing makes storing the raw files on the host a bit tricky as the user ids of the container and the host do not match ... The current solution is to make sure the /data mount point on the host is writable by everyone. Check the configuration before running the containers!


### Development

To run a stand-alone development version of the image, do:

    docker run --rm -it -e NODE_ENV=development -p 1337:1337 hostview/upload

This starts a single container with an instance of the upload app. The app is listening for file uploads in http://localhost:1337 and writes data to the container's /data (configured as a volume). All output is written to the console and you can quit with Ctrl^C.

To get a shell access to the container (will not start the app), do:

    docker run --rm -it -e NODE_ENV=development -p 1337:1337 hostview/upload /bin/bash

To mount the app source (excluding installed dependencies in node_modules on the image) and incoming data volumes on the host for faster debugging and development, do:

    docker run --rm -it -v $PWD/data:/data -v $PWD/app:/app -v /app/node_modules -e NODE_ENV=development -p 1337:1337 hostview/upload 

Alternatively, there's a Docker Compose file for running a development instance with the above volume mounts and port mapping:

    docker-compose -f dev.yml up


### Testing

Basic upload test with curl:

    curl -i -X POST localhost:1337/1234/5678/foo.txt -H "Content-Type: application/octet-stream" --data-binary "@app/test/foo.txt"

To run all the unit tests (in ./app/test), do:

    docker run --rm -e NODE_ENV=development -e TEST=1 hostview/upload


### Production

*TODO*

On the production server we start several upload app instances behind a Nginx proxy for load balancing in-coming traffic. All running apps write received files to a shared volume container (mounted on the host). In addition, the app contains a cron-job container to move received files to the target data server.

To launch the production instance, do:

    docker-compose -f prod.yml -d up
 