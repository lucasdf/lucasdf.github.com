---
layout: post
title: 'NPM: Manage Dev and Prod Dependencies'
categories: til
tags: [til-node, node]
---

When using `$ npm install --dev` the dependency is added into "devDependencies"
inside the file `packages.json`.

When `$ npm install` is used it will install both `devDependencies` and
`dependencies` by default. If the variable `NODE_ENV` is set to `production`
it will install only `dependencies`.

To install only the production dependencies (`dependencies`) regardless
of the value of the `NODE_ENV` variable, the flag `--only` should be used:
`$ npm install --only=production`.
