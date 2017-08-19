---
layout: post
title: Rename a Github Repository
categories: til
tags: [til-git, git]
---

1. First, edit the repository name in the repository settings on Github.
2. Remove the old origin using `$ git remote rm origin`
3. Add the new origin using `$ git remote add origin https://github.com/<username>/<repo-name>.git`
