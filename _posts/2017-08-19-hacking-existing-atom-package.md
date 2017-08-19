---
layout: post
title: Hacking Existing Atom Package
categories: til
tags: [til-atom, atom]
---

```
$ apm develop <package-name>
$ atom -d
```

`apm develop` will clone the repository on `~/github/<package_name>` or in the directory defined by the variable `$ATOM_REPOS_HOME`. It will also install dependencies and create a link from `~/.atom/dev/packages/<package_name>` to the repository directory.

`atom -d` opens atom in development mode with the cloned package installed. Since `$ apm develop` creates a link to the cloned repository opening Atom in development mode will automatically load the package. Note that the cloned package won't be loaded outside development mode.

If working on a PR go to the repository directory and update origin to point to your fork:

```
git remote set-url origin <https://github.com/USERNAME/REPOSITORY.git>
git remote add upstream <original-repo.git>
git fetch upstream
```
