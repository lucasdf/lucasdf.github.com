---
layout: post
title: Using virtualenv
categories: til
tags: [til-python, python]
---

## Virtualenvwrapper

[Virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/) provides
a better experience when using Virtualenv.

List environments: `$ workon`

Create environment:
```
$ mkvirtualenv <env-name>
$ mkvirtualenv <env-name> -p <path-to-python-version>
```
- Use the flag `-p` to set the Python version. Example: `-p /usr/bin/python3.6` to use python3.6.
See [How to List Installed Python Versions]({{ '/til/2017/08/17/how-to-list-installed-python-versions.html' | relative_url }}).

Remove environment: `$ rmvirtualenv <env-name>`

Activate environment: `$ workon <env-name>`

Deactivate environment: `$ deactivate`

Bind current directory with an environment, so when the environment is activated
with `$ workon <env-name>` then the shell will automatically cd into the directory:
```
$ setvirtualenvproject
```

###  Installing Virtualenvwrapper

After installation using `pip` you should:

1. Set variables:

WORKON_HOME: where new environment files will be installed.

PROJECT_HOME: projects folder to find binded environments.

Add these to the file `~/.profile`. You may change the values of `.virtualenvs`
and `projects` according to your needs:
```
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/projects
```

2. Source the script:

Add these to the file `~/.bashrc`. The value `/usr/local/bin/virtualenvwrapper.sh`
may change according to where virtualenvwrapper was installed.
```
if [ -f "/usr/local/bin/virtualenvwrapper.sh" ]; then source '/usr/local/bin/virtualenvwrapper.sh'; fi
```

## Virtualenv

Create environment: `$ virtualenv ~/.virtualenvs/env_name`

Activate environment: `$ . ~/.virtualenvs/env_name/bin/activate`

Deactivate environment: `$ deactivate`
