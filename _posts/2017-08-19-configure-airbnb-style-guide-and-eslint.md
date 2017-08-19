---
layout: post
title: Configure Airbnb Style Guide and Eslint
categories: til
tags: [til-node, node]
---

The [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript) is
the style guide for Javascript and NodeJS used by Airbnb and many other
projects.

## Configuration

Install the dependencies and add them to package.json as development dependency:
```
$ npm install -D eslint
$ npm install -D eslint-config-airbnb-base
$ npm install -D eslint-plugin-import
```

Add the npm lint script to `package.json`:
```
"scripts": {
    "lint": "eslint ."
  }
```

Create a `.eslintrc` file in the root of the project:
```
{
  "extends": "airbnb-base",
  "env": {
    "node": true
  }
}
```
- The config file above extends from the `airbnb-base` base configuration file. Rules customizations can be added to this file.
- Instead of creating the `.eslintrc` file, these configurations can also be added to the file `package.json` inside the property `eslintConfig`.

Create a `.eslintignore` file in the root of the project:
```
node_modules/**
.git/**
```
It is also a good idea to include the path for front-end libraries and vendors in the  `.eslintignore` file.

Finally, run the lint:
```
$ npm run lint
```
