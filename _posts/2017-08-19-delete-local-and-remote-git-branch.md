---
layout: post
title: Delete Local and Remote Git Branch
categories: til
tags: [til-git, git]
---

These commands can be used to remote a branch both from the local repository and
from the remote repository.

```
$ git push origin --delete <branch_name>
$ git branch -d <branch_name>
```

The flag `-d` will probably have to be replaced by `-D` if the branch has not been merged.
