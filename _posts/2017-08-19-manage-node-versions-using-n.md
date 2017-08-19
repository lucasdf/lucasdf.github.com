---
layout: post
title: Manage Node Versions Using N
categories: til
tags: [til-node, node]
---

Multiple local versions of Node can be managed using the package [n](https://www.npmjs.com/package/n).

List installed versions: `$ n`

Install and activate version:
```
$ n latest
$ n stable
$ n lts
$ n <version>
```

Fix NPM: after switching version it may be necessary to fix the NPM installation.
```
$ curl -0 -L https://npmjs.com/install.sh | sudo sh
```

Run script using a certain version:
```
$ n use <version> [args...]
```

Output the bin path:
```
n bin <version>
```

Remove version:
```
n rm <version1> <version2>
```
