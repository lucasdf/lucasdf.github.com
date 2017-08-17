---
layout: post
title: Running linters and checking the code quality
categories: til
tags: [til-python, python]
---

## Pep8
```
pep8 <package-name> OR <file-name.py> OR *.py
```

## Pylint
```
pylint <package-name> OR <file-name.py> OR *.py
pylint <package-name> -r y
```
- `-r y` enables full report.

Generate pylint config file skeleton:
```
pylint --generate-rcfile > pylintrc
```

## Flake8

```
flake8 <package-name> OR <file-name.py> OR *.py
```
