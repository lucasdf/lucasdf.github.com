---
layout: post
title: Using PDB Debugger
categories: til
tags: [til-python, python]
---

The [PDB](https://docs.python.org/3/library/pdb.html) is the built-in Python
terminal debugger.

The first step is to add a breakpoint in the code:
```
import pdb; pdb.set_trace()
```
- multiple breakpoints can be added

Now, execute the file. The debugger screen should appear in the terminal.

Common commands:

- `l .`: list current line and surrounding code. Omit the dot for subsequent calls to increase range.
- `n`: run current line and move to the next statement (step over)
- `s`: step into the current statement (step into)
- `c`: continue to the next breakpoint (or until program finishes execution)
- `r`: returns to the parent level.
- `b <path/to/script:line-number> OR <class-name.method-name> OR <function-name>`: add a breakpoint. Examples: `b test/charts_test:27`, `b ChartTopFreeTest.test_topfree_is_correct`
- `h`: help
