---
layout: post
title: Using Blog Author as the Post Author on Jekyll
date: '2017-05-17 11:20:59 -0300'
categories: howto
tags: [jekyll, structured-data]
---

Google has a tool called [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/u/0/?authuser=0) that can be used to analyze the structured data contained in a page. Structured data is a way to explain the pieces of content from a page in a way that other programs can understand. For instance, this blog post has some tags used by Google and other software to understand that this is a blog post. The specification about how this "explanation" should be done is defined [here](http://schema.org/BlogPosting). Google uses this information for its search algorithms so it is a good idea to make sure that Google has access to all information it needs to better understand your page.

The result of this tool showed me that the field "author" was missing from my posts. That's because although I was setting the author inside the file "\_config.yml", the [Minima theme](https://github.com/jekyll/minima) that I am using requires me to set the author for each post as well. I decided to make all posts to automatically get the "author" configuration from the "\_config.yml" file so I don't have to set it in each post file. There are two steps to implement this:

### 1. Create new flag on settings file

A new variable needs to be added to the file "\_config.yml". The variable "author" on this same file also need to be defined. I am using "use_blog_author" as the name of this new variable.

{% highlight config %} {% raw %}
use_blog_author: true
{% endraw %} {% endhighlight %}

### 2. Edit the post layout to use the new variable

To use the new variable it is necessary to edit the default layout used by posts. To do so we need to edit the post layout file: create a folder named "\_layouts" inside the project root and then create the file "posts.html". Then paste the original content in the file and edit the part where the author is written to the page. The original file location can be found by using the command ```bundle show minima```.

{% highlight liquid %} {% raw %}
{% unless page.author == false %}
{% if page.author %}
• <span itemprop="author" itemscope="" itemtype="http://schema.org/Person">
    <span itemprop="name">{{ page.author }}</span>
  </span>
{% elsif site.use_blog_author %}
• <span itemprop="author" itemscope="" itemtype="http://schema.org/Person">
    <span itemprop="name">{{ site.author }}</span>
  </span>
{% endif %}
{% endunless %}
{% endraw %} {% endhighlight %}

If the post does not have a variable "author" as part of its Front Matter then the variable "author" from the file "\_config.yml" will be used. If the post has a variable "author" and its value is set to "false" then the post won't display any author name. Finally, we may set a custom author for each post by using a value different than "false".

### Making my blog compliant with Structured Data

As explained before, many sites use the structured data content to understand other sites. This could mean a better Google search ranking or more reach on social media when a post is shared by readers. So I would recommend everyone to use the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/u/0/?authuser=0) from Google and make sure that all items are correct. To my end, I still need to edit my blog to implement the fields "publisher", "dateModified" and "mainEntityOfPage".
