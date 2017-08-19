---
layout: post
title: Reload Node Server When a File Changes with Nodemon
categories: til
tags: [til-node, node]
---

To reload a server when a file changes [nodemon](https://nodemon.io/) can be used.
This solution is good enough for development servers, while better solutions
are recommended for production servers, such as using [pm2](http://pm2.keymetrics.io/)

Run a script with nodemon:
```
$ nodemon <script-file>
```

It is also possible to use it as an application script:
```
$ npm install --save-dev nodemon
```

Add these to `package.json`:
```
"scripts": {
    "start": "nodemon entry.js -devmode -something 1"
  }
```
And then run:
```
$ npm run start
```
