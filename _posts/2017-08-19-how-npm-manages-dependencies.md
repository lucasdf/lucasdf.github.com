---
layout: post
title: How NPM Manages Dependencies
categories: til
tags: [til-node, node]
---

NPM installs package-specific modules inside the directory `./node_modules`. Global packages installed using the `-g` flag are installed available inside the node directory (usually inside `/usr/local`).

Each project has its own version of each dependency. So, if you have ten projects using the same version of Express each of them will keep its own copy of Express (and all its dependencies). This is the best way to ensure a sane dependency management and allow freedom to make upgrades/downgrades of versions.

Comparing to the Python environment, the way NPM deals with packages is similar as using `pip` and `virtualenv` together.
