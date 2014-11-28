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

First the job needs an executable. HTCondor needs a local executable
(on the batch.canfar.net) that will be transfered to the VM and be
executed. For example, if one wants to execute the `echo` command on
the VM, the local script would contain:
{% highlight text %}
#!/bin/bash
echo $*
{% endhighlight %}
Let's name the local script `myexec.bash`. We now have to choose a
machine that will execute the transfered script. Assuming an image
called "my_image" has been created following the.
[VM management guide]({{site.basepath}}/docs/vmacess). Now to execute the command `echo` we
need the smallest possible resource flavour that can boot the
`my_image` VM, that is `m1.small` (assuming it was tested previously
interactively). Open your favorite editor, and write a file
`myjob.jdl`, containing:

{% highlight text %}
+VMAMI          = "canfar:my_image"
+VMInstanceType = "canfar:m1.small"

executable = myexec.bash

output     = myjob.out
error      = myjob.err
log        = myjob.log

arguments = "Hello World"
queue
{% endhighlight %}
Here are the explanations of the other parameters:
- `output` will be the result of the `stdout` from the execution
that will be transfered back to batch.canfar.net at the end of the
job.
- `error` is the corresponding `stderr`
- `log` is a logging of `HTCondor` activities
- `arguments` contains the arguments we want to pass to the
`executable`
- `queue` means "sends a job" with these `arguments` previously defined

## Managing Batch Jobs on the submission host

### Job Submission
In this case, the submission files and the `executable` will have to reside on the CANFAR
login portal. Connect to the portal:

{% highlight bash %}
ssh USERNAME@batch.canfar.net
{% endhighlight %}

Set up your password for your nefos project account (where your VM
image is):
{% highlight bash %}
export OS_PASSWORD="my_password"
{% endhighlight %}

Then share your VM with CANFAR, validate your submission file, and send the job all at once with the
following command:

{% highlight bash %}
canfar_submit myjob.jdl
{% endhighlight %}
The job that was actually submitted is a validated condor submission file named `myjob_canfar.jdl`.

If you want more control, decompose it in three steps:
- First share your VM image with the CANFAR project (the one with a
lot of resource allocation):

{% highlight bash %}
canfar_vm_share my_image
{% endhighlight %}

- then validate your job file:
{% highlight bash %}
canfar_valid_job myjob.jdl
{% endhighlight %}

- finally send the validated file with `HTCondor` directly:
{% highlight bash %}
condor_submit myjob_canfar.jdl
{% endhighlight %}


### Checking Job Status
`HTCondor` offers a great deal of command line tools to check the status
of the VM and the job.

For a more exhaustive list of commands, we refere the reader to
the official
[HTCondor user documentation](http://research.cs.wisc.edu/htcondor/manual/v8.2/2_Users_Manual.html)
or our [HTCondor cheat sheet[({{site.basepath}}/docs/vmacess]).

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

## Troubleshooting
