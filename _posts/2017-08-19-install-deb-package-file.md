---
layout: post
title: Install .deb Package File
categories: til
tags: [til-linux, linux]
---

To install a .deb file use: `$ dpkg -i <.deb-file>`

It may be a good idea to use `$ apt-get install -f` after installing a file using this method, since this method may not install the dependencies that the package needs. This option will look for packages with broken dependencies and fix them.
