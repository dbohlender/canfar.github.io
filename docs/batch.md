---
layout: docs
title: Batch Jobs
permalink: /docs/batch/
---

Batch processing is a standard way to queue and run large amount of tasks while sharing the resources with other groups. In CANFAR, we provide a batch processing system which users can access either through a minimal http service, or with many more features using a login portal to launch and manage processing jobs.

## Batch Framework on the CANFAR clouds

CANFAR scheduling system is orcherstrated with the [HTCondor](http://www.htcondor.org) high throughput computing software, and the [cloud-scheduler](http://www.cloudscheduler.org) to allow multi-clusters (multi-clouds) batch processing.

For a typical CANFAR user, `HTCondor` will be similar use as other scheduling software that can be found on High Performance Computing platforms, such as PBS/Torque, Sun Grid Engine, or Slurm.
Most users will not have to care about the cloud scheduler since it runs in the background launching VMs while monitoring the jobs queues, but HTCondor is important to understand in order to manage and submit jobs.

## Writing a Batch Job 

Running a job with CANFAR means executing a program on a Virtual Machine. So first thing is to write a script that HTCondor will forward to the VM and execute it. So it has to be a local executable. For example, if one wants to execute the `echo` command on the VM, the local script could contain:

{% highlight bash %}
#!/bin/bash
echo $*
{% endhighlight %}

Let's name the local script `myexec.bash`. We now have to choose a machine that will execute the transfered script. Let's assume an image is called `my_image` has been created following the [tutorial]({{site.basepath}}/docs/tutorial). Now to execute the command `ls` we need the smallest possible resource flavour that can boot the `my_image` VM, that is `c1.low`. Open your favorite editor, and  write a file `myjob.jdl`. A typical job will be like this:

{% highlight text %}
Universe   = vanilla
should_transfer_files = YES
when_to_transfer_output = ON_EXIT_OR_EVICT
RunAsOwner = True

transfer_output_files = /dev/null

executable = myexec.bash

arguments = "Hello World"
output     = hello.out
error      = hello.err
log        = hello.log

queue
{% endhighlight %}

Here are the explanations of the other parameters:
- `output` will be the result of the `stdout` from the execution
that will be transfered back to batch.canfar.net at the end of the
job.
- `error` is the corresponding `stderr`
- `log` is a logging of `HTCondor` activities
- `arguments` contains the arguments we want to pass to the `executable`
- `queue` means "sends a job" with the `arguments` previously defined


### Multi jobs per VM or Multi-threading

By default, a batch scheduled VM will spawn the same amount of jobs as there are CPUs in the requested flavour. A c2.low flavour will launch a 2 cores VM, thus launch 2 jobs per VM.  It could be more efficient, and request an 8 cores flavours that will spawn 8 jobs per VM. The I/O will also be improved, since job separation will be done at HTCondor level instead at the hypervisor. However if you need the whole VM for your job, such as in multi-threading, you will need extra requirements. In this case use one of the following parameter in your job submission file:
- request_memory = XXX
- request_cpus = XXX
- request_disk = XXX
You can also add a different request parameter per job. The VMs will be dynamically partioned into jobs to maximally fit the VM flavour.
See the [submission manual page](http://research.cs.wisc.edu/htcondor/manual/current/condor_submit.html) for reference on the HTCondor request parameters.

## Managing Batch Jobs on the submission host

### Job Submission
In this case, the submission files and the executable will have to reside on the CANFAR batch login node. Connect to the batch node with your CANFAR username (refered as`[username]`):

{% highlight bash %}
ssh [username]@batch.canfar.net
{% endhighlight %}

Then you will need to source your credentials to access your tenant's VMs:

{% highlight bash %}
. canfar-[tenantname]-openrc.sh
{% endhighlight %}

This file is the same as the one you can download from your tenant, when clicking in the **API Access** tab from your [dashboard](https://west.cloud.computecanada.ca/dashboard/project/access_and_security/).
Now to submit the job, there is a special wrapper script that will share your VM with CANFAR, add some boiler plate lines for the cloud-scheduler, validate and submit the job. Instead of running `condor_submit`, you run:
{% highlight bash %}
canfar_submit myjob.jdl [tenant_name]:[snapshot_name] c2.low
{% endhighlight %}


### Checking Job Status
`HTCondor` offers a great deal of command line tools to check the status of the VM and the job.
For a more exhaustive list of commands, we refere the reader to the official [HTCondor user documentation](http://research.cs.wisc.edu/htcondor/manual/v8.2/2_Users_Manual.html)
or a very good overview and cheat sheet on [SIEpedia](http://www.iac.es/sieinvens/siepedia/pmwiki.php?n=HOWTOs.Condor).

See where your jobs stand on the global queue

{% highlight bash %}
condor_q
{% endhighlight %}

and look for the status R: running, I: inactive, X: marked for removal.

See why your job 11.3 is still idle (job status is "I"):

{% highlight bash %}
condor_q -better-analyze 11.3 
{% endhighlight %}

Check to see if your VMs are joining the pool of execution hosts:

{% highlight bash %}
condor_status 
{% endhighlight %}

