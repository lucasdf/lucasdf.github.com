---
layout: post
title: Trap Control+C in Bash
categories: til
tags: [til-bash, bash]
---

It is possible to trap the interrupt signal:
```bash
# trap ctrl-c and call ctrl_c()
trap ctrl_c INT

function ctrl_c() {
        echo "** Trapped CTRL-C"
}
```

Command  | Explanation
------------ | -------------
trap 'echo "Shell command here";' | INT	Perform any shell command in the single quotes when the "INT" signal is generated
trap '' INT | Ignore "INT" signal (use with caution)
trap - INT | Restore the "INT" signal handler to the default action

<br>

```bash
trap '{ echo "Hey, you pressed Ctrl-C.  Time to quit." ; exit 1; }' INT
echo "Counting to 5 slowly, press Ctrl-C to interrupt."
for number in 1 2 3 4 5; do
    echo $number
    sleep 1
done

trap '' INT
echo "Counting to 5 again, but pressing Ctrl-C shouldn't work."
for number in 1 2 3 4 5; do
    echo $number
    sleep 1
done

trap - INT
echo "One more time, but Ctrl-C should work again."
for number in 1 2 3 4 5; do
    echo $number
    sleep 1
done
exit 0
```

**most of the information contained in this post was shamelessly taken from [this page](http://kb.mit.edu/confluence/pages/viewpage.action?pageId=3907156)**. If you found this useful I recommend you to also go there and check its content.
