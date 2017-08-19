---
layout: post
title: Keep a Fork Updated
categories: til
tags: [til-git, git]
---

Add a new remote pointing to the original repository:
```
$ git remote add upstream <original-repo.git>
```

Fetch the changes. Repeat this step whenever the original repository changes:
```
$ git fetch upstream
```

Update the local fork using merge:
```
$ git pull upstream master
$ git pull upstream <branch-to-update>
```

Or update the local fork using rebase:
```
$ git rebase upstream/master
$ git rebase upstream/<branch-to-rebase>
```
