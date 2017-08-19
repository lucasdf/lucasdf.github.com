---
layout: post
title: Run Container and Expose Port to Host
categories: til
tags: [til-docker, docker]
---
When starting a container using `run` it is possible to expose a port from the container to the host computer. In this case the flag `p <host-port>:<container-post>` is used:
```
$ docker run -d -p <host-port>:<container-port> <image-name>
$ docker run --name mongo-container -d mongo -p 27017:27017
```

It is possible to provide multiple arguments of `-p` to expose multiple ports.

The expose configuration can also be defined inside a Dockerfile or a docker-compose file.
