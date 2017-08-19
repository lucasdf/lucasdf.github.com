---
layout: post
title: Terminal Reverse Search
categories: til
tags: [til-linux, linux]
---

`control + r` can be used to search through the bash command history. Repeat the same command multiple times to cycle through older entries.

The history is stored in the file `~/.bash_history`. The env variable `HISTSIZE` defines the number of commands stored for the active bash session and the env variable `HISTFILESIZE` defines the number of commands stored in disk.
