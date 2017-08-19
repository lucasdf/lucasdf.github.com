---
layout: post
title: Temporary Directory /tmp
categories: til
tags: [til-linux, linux]
---

The directory `/tmp` is used to store temporary files. The directory is usually cleared on reboot.

It is possible to change this behaviour. To delete only the files older than x days on reboot, edit the file `/etc/default/rcS`.

For instance, to keep files for two days before deleting them:
```
TMPTIME=2
```
