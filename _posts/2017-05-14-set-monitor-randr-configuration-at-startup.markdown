---
layout: post
title:  "How To Set Monitor Configuration at Startup Time"
date:   2017-05-13 23:59:59 -0300
categories: howto
tags: [i3, linux]
---
While playing with the [i3 tiling manager](http://i3wm.org) tool I had this issue where the workspace number two would appear on my primary screen and the workspace number one would appear on my second monitor.

The solution for that was to create a ~/.xprofile file containing my randr configuration:

```shell
xrandr --output VGA-0 --mode 1920x1080 --pos 1920x0 --rotate normal --output DVI-D-0 --off --output HDMI-0 --primary --mode 1920x1080 --pos 0x0 --rotate normal
```

Now these settings are executed at startup and i3 is starting the workspaces on the right monitors. To generate the xrandr command I used the tool "arandr" to set the settings and used the functionality "save as" to export the configuration command.

By the way, i3 is awesome!
