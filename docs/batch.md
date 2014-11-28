---
layout: docs
title: Batch Jobs
permalink: /docs/batch/
---

Batch processing is a standard way to queue and run large amount of tasks while
sharing the resources with other groups. In CANFAR, we
provide a batch processing system which users can access either
through a minimal http service, or with many more features using a
login portal to launch and manage processing jobs.

## Batch Framwork on the CANFAR clouds

CANFAR scheduling system is orcherstrated with the [HTCondor](http://www.htcondor.org) high
throughput computing software, and the [cloud-scheduler](http://www.cloudscheduler.org) to allow
multi-clusters (multi-clouds) batch processing.

For a typical CANFAR user, `HTCondor` will be similar to a lot like
other queue scheduling software that can be found on High Performance
Computing platforms, such as PBS/Torque, Sun Grid Engine,
or Slurm,

Most users will not have to care about the cloud scheduler since it
runs in the background launching VMs while monitoring the jobs queues, but
HTCondor is important to understand in order to manage and submit jobs.

## Writing a batch job

CANFAR batch job is using HTCondor syntax. Assume there is a
executable located in ${HOME}/myexec.bash

{% highlight text %}
+VMAMI          = "canfar:my_image"
+VMInstanceType = "canfar:m1.small"

executable = echo
output     = myjob.out
error      = myjob.err
log        = myjob.log

arguments = "Hello World"
queue
arguments = "Oh Canada"
queue
{% endhighlight %}

If you need to process lots of jobs, we strongly recommand to read the
documentation for writing condor submission files at [XXXX].

## Managing Batch Jobs on the submission host

### Job Submission
In this case, the submission files will have to reside on the CANFAR
login portal. First, connect to the portal:
{% highlight bash %}
ssh USERNAME@batch.canfar.net
{% endhighlight %}
Then submit your job:
{% highlight bash %}
condor_submit myjob.jdl
{% endhighlight %}
Count the dots, there should be as many as jobs you sent.

### Checking Job Status
`HTCondor` offers a great deal of command line tools to check the status
of the VM and the job. Here is a list of the usual commands to 

For a more exhaustive list of commands, we refere the reader to
the official HTCondor documentation

See where your jobs stand on the global queue
{% highlight bash %}
condor_q
{% endhighlight %}

and look for the status R: running, I: inactive, X: marked for
removal.

See why your job 11.3 is still idle (job status is "I"):
{% highlight bash %}
condor_q -better-analyze 11.3 
{% endhighlight %}

Check the status of the execution hosts (VMs):

{% highlight bash %}
condor_status 
{% endhighlight %}

## Managing Batch Jobs from your local computer using CANFAR web service

## Troubleshooting your jobs

## Advanced Batch Processing

## HTCondor Cheat Sheet
