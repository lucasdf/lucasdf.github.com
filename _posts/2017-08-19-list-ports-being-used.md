---
layout: post
title: List Ports Being Used
categories: til
tags: [til-linux, linux]
---

List the open ports that are being listened for connections and information like protocol and application using the port:
```
$ lsof -i -n -P | grep LISTEN
```

It may be interesting to add this to an alias:
```
$ alias lsp='lsof -i -n -P | grep LISTEN'
$ lsp
```
