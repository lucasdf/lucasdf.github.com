---
layout: post
title: Set up Let's Encrypt SSL certificate with AWS Elastic Beanstalk single-instance
date: '2017-07-21 20:50:00 -0300'
categories: howto
tags: [aws, aws-elastic-beanstalk, ssl, https]
---

Add a free SSL certificate from Let's Encrypt and configure an Elastic Beanstalk application to use it. These instructions work for environments running behind Apache, such as the Python and the PHP environments. If you are running an environment behind Nginx you can adapt the Apache's .conf file showed here to the Nginx equivalent.

You may check the final file in [my Github](https://github.com/lucasdf/demo-lets-encrypt-elastic-beanstalk).

<!-- @import "[TOC]" {cmd:"toc", depthFrom:1, depthTo:6, orderedList:false} -->

<!-- code_chunk_output -->

* [Introduction](#introduction)
* [The "ssl.config" file](#the-sslconfig-file)
	* [Add the Apache conf file](#add-the-apache-conf-file)
	* [Instance commands to issue the certificate](#instance-commands-to-issue-the-certificate)
	* [Install the apache SSL extension](#install-the-apache-ssl-extension)
	* [It is working!](#it-is-working)
* [Renewing the certificate automatically](#renewing-the-certificate-automatically)
* [Conclusion](#conclusion)

<!-- /code_chunk_output -->

## Introduction

[Let's Encrypt](https://letsencrypt.org/) offers free SSL certificates that can be used by anyone to improve the user's security and privacy. In this tutorial, I will explain how to enable a certificate from Let's Encrypt in an application running on a single instance of Elastic Beanstalk. The instruction is focused on applications running on a single instance since it is simple to configure HTTPS certificate from AWS itself when using a load balancer. If you are trying to do so just follow [these instructions](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/configuring-https-elb.html)

## The "ssl.config" file

The first step is to create a directory named *.ebextensions* in the root of your project. The files under this directory are used by Elastic Beanstalk to configure and customize the application environment.

### Add the Apache conf file

Inside the directory you should create a file named *ssl.config* and add the code below to it:

{% highlight yml linenos %}
files:
  /tmp/ssl.conf:
    mode: "000644"
    owner: root
    group: root
    content: |
      LoadModule wsgi_module modules/mod_wsgi.so
      WSGIPythonHome /opt/python/run/baselinenv
      WSGISocketPrefix run/wsgi
      WSGIRestrictEmbedded On
      Listen 443
      <VirtualHost *:443>
        SSLEngine on
        SSLCertificateFile "/etc/letsencrypt/live/ebcert/fullchain.pem"
        SSLCertificateKeyFile "/etc/letsencrypt/live/ebcert/privkey.pem"

        Alias /static/ /opt/python/current/app/static/
        <Directory /opt/python/current/app/static>
        Order allow,deny
        Allow from all
        </Directory>

        WSGIScriptAlias / /opt/python/current/app/application.py

        <Directory /opt/python/current/app>
        Require all granted
        </Directory>

        WSGIDaemonProcess wsgi-ssl processes=1 threads=15 display-name=%{GROUP} \
          python-path=/opt/python/current/app:/opt/python/run/venv/lib/python3.4/site-packages:/opt/python/run/venv/lib64/python3.4/site-packages \
          home=/opt/python/current/app \
          user=wsgi \
          group=wsgi
        WSGIProcessGroup wsgi-ssl

      </VirtualHost>
      <VirtualHost *:80>
          RewriteEngine On
          RewriteCond %{HTTPS} off
          RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI}
      </VirtualHost>
      LogFormat "%h (%{X-Forwarded-For}i) %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
{% endhighlight %}

You may need to customize two pieces of the file above:
1. If you are using Python 2.7 then you should replace the line 30 by
`python-path=/opt/python/current/app:/opt/python/run/venv/lib/python2.7/site-packages:/opt/python/run/venv/lib64/python2.7/site-packages`. This will add the correct directories to your path according to the platform that you are using.
2. If your *WSGIPath* file is not *application.py* then you should replace the line 23 to use the correct path.

This file does a couple of things:
- It sets a couple of configurations related to the WSGI server. The values here are the same used by Elastic Beanstalk as default.
- It listens to 443 and enables the SSL engine. Also, it specifies the certificate location.
- It redirects any attempt to use HTTP to HTTPS.

### Instance commands to issue the certificate

Now we need to add the commands to issue the certificate and to use this new configuration. Append these lines to the file *ssl.config*:

{% highlight yml linenos %}
container_commands:
  # creates a swapfile to avoid memory errors in small instances
  00_enable_swap:
    command: "sudo swapoff /tmp/swapfile_certbot ; sudo rm /tmp/swapfile_certbot ; sudo fallocate -l 1G /tmp/swapfile_certbot && sudo chmod 600 /tmp/swapfile_certbot && sudo mkswap /tmp/swapfile_certbot && sudo swapon /tmp/swapfile_certbot"
  # installs certbot
  10_install_certbot:
    command: "mkdir -p /opt/certbot && wget https://dl.eff.org/certbot-auto -O /opt/certbot/certbot-auto && chmod a+x /opt/certbot/certbot-auto"
  # issue the certificate if it does not exist
  20_install_certificate:
    command: "sudo /opt/certbot/certbot-auto certonly --debug --non-interactive --email ${LETSENCRYPT_EMAIL} --agree-tos --standalone --domains ${LETSENCRYPT_DOMAIN} --keep-until-expiring --staging"
  # create a link so we can use '/etc/letsencrypt/live/ebcert/fullchain.pem'
  # in the apache config file
  30_link:
    command: "ln -sf /etc/letsencrypt/live/${LETSENCRYPT_DOMAIN} /etc/letsencrypt/live/ebcert"
  # move the apache .conf file to the conf.d directory.
  # Rename the default .conf file so it won't be used by Apache.
  40_config:
    command: "mv /tmp/ssl.conf /etc/httpd/conf.d/ssl.conf && mv /etc/httpd/conf.d/wsgi.conf /etc/httpd/conf.d/wsgi.conf.bkp || true"
  # clear the swap files created in 00_enable_swap
  50_cleanup_swap:
    command: "sudo swapoff /tmp/swapfile_certbot && sudo rm /tmp/swapfile_certbot"
  # kill all httpd processes so Apache will use the new configuration
  60_killhttpd:
    command: "killall httpd ; sleep 3"
  # Add renew cron job to renew the certificate
{% endhighlight %}

The steps *00_enable_swap* and *50_cleanup_swap* are necessary if you are using small instances such as t2.nano or t2.micro. This will create a swap file of 1GB and then delete it at the end of the process. Otherwise, some error may occur when installing the certbot program. This issue is described [here](https://certbot.eff.org/docs/install.html#problems-with-python-virtual-environment).

Note that the file is using these two environment variables. You must set them inside the Elastic Beanstalk console or through other means:
1. **LETSENCRYPT_DOMAIN**: the domain for who the certificate will be issued, such as *yourdomain.com* or *sub.yourdomain.com*.
2. **LETSENCRYPT_EMAIL**: Contact email.

### Install the apache SSL extension

Finally, it is necessary to install the package *mod24_ssl*. To do so, append the following lines to the file *ssl.config*:

{% highlight yml linenos %}
packages:
  yum:
    mod24_ssl : []
{% endhighlight %}

### It is working!

You may upload your application now and it should be possible to access your site using HTTPS. Also, any attempt to use HTTP should redirect to HTTPS. Remember that your application should be accessible on port 443, so you may need to edit your application's security group rules.

You may notice that you will see an invalid certificate warning in the browser. That's because the flag *--staging* is being used in the command */opt/certbot/certbot-auto certonly*. **Remove this flag in production** after testing that it works with staging.

## Renewing the certificate automatically

The certificates issued by Let's Encrypt have a short duration. Every time that your application is updated the command *20_install_certificate* will install or update the certificate if it is expiring. However, this only run when the application is updated. If the application is running for a long time the certificate may expire. So, it is a good idea to add a cron job that will renew the certificate automatically.

To do so you should add another file to the files directive inside *ssl.config*. This should go after or before the */tmp/ssl.conf* instruction.
{% highlight yml linenos %}
files:
  /tmp/ssl.conf:
    ...
  /tmp/certificate_renew:
    mode: "000644"
    owner: root
    group: root
    content: |
      0 0 * * 0 root /opt/certbot/certbot-auto renew --standalone --pre-hook "killall httpd" --post-hook "sudo restart supervisord || sudo start supervisord" --force-renew >> /var/log/certificate_renew.log 2>&1
{% endhighlight %}

Now you should append a new instruction to *container_commands*:
{% highlight yml linenos %}
container_commands:
  ...
  70_cronjob_certificate_renew:
      command: "mv /tmp/certificate_renew /etc/cron.d/certificate_renew"
{% endhighlight %}

That's it. Now every week the cron job will run and update your certificate.

## Conclusion

It is quite simple to use the certificate from Let's Encrypt although it is not as simple as setting up a load balancer certificate. Since most of the time the application will run behind a load balancer, all of this won't be necessary. However, sometimes you may want to run it as single-instance, such as when you don't really need multiple instances or if you are just trying things out and don't want to pay for the load balancer.

To deploy it into production **remove the flag --staging** from the command */opt/certbot/certbot-auto certonly*

If you are not using the Python environment then you may adapt the file using the intructions from [this page](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/https-singleinstance.html) as reference.

You may check the final file in [my Github](https://github.com/lucasdf/demo-lets-encrypt-elastic-beanstalk). You may also be interested in checking [this](https://gist.github.com/tony-gutierrez/198988c34e020af0192bab543d35a62a) and [this](https://gist.github.com/Giaco9/41cba9e5b5bff75ec45610a9bdd84914) examples. You can find the reference for the Certbot program [here](https://certbot.eff.org/docs/using.html).
