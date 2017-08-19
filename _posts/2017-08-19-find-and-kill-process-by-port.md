---
layout: post
title: Find and Kill Process by Port
categories: til
tags: [til-linux, linux]
---

It is possible to find the process running on some port and then kill it:
```
sudo netstat -lpn |grep :'3000'
kill -9 <process-number>
```
