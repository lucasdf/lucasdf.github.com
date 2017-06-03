---
layout: post
title: "Running Python's PDB debugger with Docker, Flask and Gunicorn"
date: '2017-06-03 15:00:00 -0300'
categories: howto
tags: [docker, python]
---

- [Introduction](#introduction)
- [Setup the dockerized Flask application](#setup-the-dockerized-flask-application)
- [Adding support for PDB debug](#adding-support-for-pdb-debug)
- [Debugging](#debugging)
- [Conclusion](#conclusion)

## Introduction

I have recently started using the Python's command-line debugger [PDB](https://docs.python.org/3/library/pdb.html) and I had a hard time to figure it out how to use it with Docker. I will be explaining how to create a Flask application that runs on Docker and then explain how to use the PDB debugger in this application. It should not be hard to use this same explanation to use the debugger in other setups like a Django or a pure Python application.

You can grab the whole demo code [here](https://github.com/lucasdf/demo-docker-flask-pdb).

## Setup the dockerized Flask application

Let's start by setting up a simple Flask application that runs on Docker using Docker Compose. Docker Compose is not strictly required and something similar can be achieved by using just a Dockerfile. However, most project use Docker Compose to orchestrate multiple services like a web application and a database, so that's what we will be using here. We only need a few files to setup the application:

### Directory structure:
```
.
+-- docker-compose.yml
+-- demo_web
|   +-- app.py
|   +-- requirements.txt
|   +-- Dockerfile
```

**docker-compose.yml**
Here the service `demo_web` is declared. Our host port 80 is mapped into the container's port 8000. If you already have something running on port 80 you should change this number. The `command` declaration simply tells Docker to start the Flask application using gunicorn. The `volumes` declaration will map the directory `demo_web` from the host to the container's directory so we may make changes to the files like adding debugging statements and see the result without having to restart the Docker container.
```yaml
version: '3'

services:
    demo_web:
        build:
            context: .
            dockerfile: demo_web/Dockerfile
        ports:
            - "80:8000"
        command: /usr/local/bin/gunicorn -w 2 -b :8000 app:app --reload
        volumes:
            - ./demo_web:/usr/src/app    
```

**./demo_web/app.py**
Nothing much here, just a very basic Flask application. We will return to this file later to add the debug breakpoint.
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_pdb():
    message = 'Hello Docker'
    return message
```

**./demo_web/requirements.txt**
Docker will install these dependencies **inside** the container.
```
Flask
gunicorn
```

**./demo_web/Dockerfile**
The Dockerfile image for the Flask application. I am using Python 3.6 with Linux Alpine version, so it should occupy little disk space. Any other Python or Linux version should work as well.
```dockerfile
FROM python:3.6.1-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY demo_web/requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt
```

### Running

We should be able to execute `docker-compose up -d --build` inside the project's root directory to start the application. If you go to `localhost` you should be able to see `Hello Docker` printed on the screen.

## Adding support for PDB debug

We should change two things in the file `docker-compose.yml` to support the PDB debugger:
1. Add `stdin_open: true` and `tty: true` to the service configuration. These options will allow us to attach into the gunicorn running process and use the debugger.
2. Add `-t 3600` to the gunicorn command. This will change the timeout value to 3600 seconds. The default value of 30 seconds would probably kill the process before we finish using the debugger, so this value must be increased.

**docker-compose.yml**
```yaml
version: '3'

services:
    demo_web:
        build:
            context: .
            dockerfile: demo_web/Dockerfile
        ports:
            - "80:8000"
        command: /usr/local/bin/gunicorn -w 2 -t 3600 -b :8000 app:app --reload
        volumes:
            - ./demo_web:/usr/src/app
        stdin_open: true
        tty: true
```

## Debugging

Now if we use `docker-compose up -d --build` to restart the containers we should see the message `Hello Docker` and everything should stay the same. The difference is that we can start debugging now.

### Add a breakpoint to the application:
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_pdb():
    message = 'Hello Docker'
    import pdb; pdb.set_trace()
    return message
```

### Attach into the gunicorn process

The debugger is running inside the container, so we need to attach into the container to use it.

1. Find the container id using `docker container ps` and copy the first two or three letters of the container id column.
2. Use the command `docker attach CONTAINER_ID` to attach to the container.

Now just navigate to the page and the debugger will start, so you will be able to use the usual commands like `n` or `c`. For instance, you could execute `message = 'Hello PDB'` and press `c` to continue the execution. Now check the browser and instead of seeing 'Hello Docker' you should see 'Hello PDB' on the page.

To exit you should use `CONTROL + P, CONTROL + Q`. This will detach from the container without killing it. If you use `Control + C` the container will stop.

## Conclusion

To use the Python PDB debugger with Docker we just need to add the configurations `stdin_open: true` and `tty: true`, add the breakpoints and then attach into the container when we want to use the debugger. This process should also work when using other servers instead of gunicorn.
