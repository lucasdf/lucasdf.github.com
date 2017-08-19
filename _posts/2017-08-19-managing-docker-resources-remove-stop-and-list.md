---
layout: post
title: 'Managing Docker Resources: remove, stop and list'
categories: til
tags: [til-docker, docker]
---

Dangling resource are unused resources that are not related to any other active resource anymore.

## Images
- List all images: `$ docker images -a`
- Remove all images: `$ docker rmi $(docker images -a -q)`
- Remove specific images: `$ docker rmi <image1> <image2>`

---
- List dangling images: `$ docker images -f dangling=true`
- Remove dangling images: `$ docker rmi $(docker images -f dangling=true -q)`

---
- List images according to pattern: `$ docker ps -a |  grep "pattern"`
- Remove images according to pattern: `$ docker images | grep "pattern" | awk '{print $1}' | xargs docker rm`


## Containers

- List all containers: `$ docker ps -a`
- Stop all containers: `$ docker stop $(docker ps -a -q)`
- Remove all containers: `$ docker rm $(docker ps -a -q)`
- Remove specific containers: `$ docker rm <container1> <container2>`

---
- List exited containers: `$ docker ps -a -f status=exited`
- Remove exited containers: `$ docker rm $(docker ps -a -f status=exited -q)`

Multiple filters can be added to list and remove commands. For instance, to
list container with status exited or created use `docker ps -a -f status=exited -f status=created`.

---
- List containers according to pattern: `$ docker ps -a |  grep "pattern”`
- Remove containers according to pattern: `$ docker ps -a | grep "pattern" | awk '{print $3}' | xargs docker rmi`

## Volumes

- List all volumes: `$ docker volume ls`
- Remove specific volumes: `$ docker volume rm <volume1> <volume2>`

---
- List dangling volumes: `$ docker volume ls -f dangling=true`
- Remove dangling volumes: `$ docker volume rm $(docker volume ls -f dangling=true -q)`
