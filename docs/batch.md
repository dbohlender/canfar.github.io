---
layout: docs
title: Batch Jobs
permalink: /docs/batch/
---

Batch processing is a standard way to queue and run large amount of tasks while sharing the resources with other groups. In CANFAR, we provide a batch processing system which users can access either through a minimal http service, or with many more features using a login portal to launch and manage processing jobs.

## Batch Framework on the CANFAR clouds

CANFAR scheduling system is orcherstrated with the [HTCondor](http://www.htcondor.org) high throughput computing software, and the [cloud-scheduler](http://www.cloudscheduler.org) to allow multi-clusters (multi-clouds) batch processing.

For a typical CANFAR user, `HTCondor` will be similar use as other scheduling software that can be found on High Performance Computing
platforms, such as PBS/Torque, Sun Grid Engine, or Slurm. Most users will not have to care about the cloud scheduler since it runs in the background launching Virtual Machines (VMs) while monitoring the jobs queues, but HTCondor is important to understand in order to submit and manage jobs.

## Writing a Batch Job 

Running a job with CANFAR means executing a program on a Virtual Machine. So first thing is to write a script that HTCondor will forward to the VM and execute it. It has to be a local executable. For example, if one wants to execute the `echo` command on the VM, the local script could contain:

{% highlight bash %}
#!/bin/bash
echo $*
{% endhighlight %}

Let's name the local script `myexec.bash`. We now have to choose a machine that will execute the transfered script. Let's assume a VM image is called `my_vm_image` has been created following the [tutorial]({{site.basepath}}/docs/tutorial). Now to execute the command `ls` we need the smallest possible resource flavour that can boot the `my_vm_image` VM, that is `c1-7.5gb-30`. Open your favorite editor, and write a job file `myjob.jdl`. A typical job will be like this:

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
queue 4

arguments = "Bonjour Monde"
output     = bonjour.out
error      = bonjour.err
log        = bonjour.log
queue 4
{% endhighlight %}

Here are the explanations of the other parameters:
- `output` will be the result of the `stdout` from the job execution that will be transfered back to the login portal batch.canfar.net at the end of the job.
- `error` is the corresponding `stderr` of the job execution
- `log` is a log of `HTCondor` activities
- `arguments` contains the arguments we want to pass to the `executable`
- `queue 4` means "sends 4 jobs", all with the `arguments` previously defined.


### Multi jobs per VM or Multi-threading

By default, a batch scheduled VM will spawn the same amount of jobs as there are CPUs in the requested flavour. A c8-30gb-380 flavour will launch an 8 cores VM, thus launch 8 jobs per VM. Most of the time it is more efficient to request fairly large flavours to spawn multiple concurrent jobs per VM. Imagine a bare metal node with 16 cores: the overhead of running two 8 cores VMs (2 hypervisors + 2 HTCondor + 16 jobs) vs running 16 one core VMs (16 hypervisors + 16 HTCondor + 16 jobs).

However in some cases you need the whole VM for your job. Multi-threaded programs will usually benefit from it. You will need extra resource requirements in your job submission file. For example, if you need a minimum of 8 cores, 16GB of RAM and 250GB of scratch space for your job, use the following parameters in your job submission file:

- request_memory = 16000 
- request_cpus = 8
- request_disk = 250000000

You can also add a different request parameter per job. The VMs will be dynamically partioned into jobs to maximally fit the VM flavour. See the [submission manual page](http://research.cs.wisc.edu/htcondor/manual/current/condor_submit.html) for reference on the HTCondor request parameters. 

## Managing Batch Jobs on the submission host

### Job Submission
In this case, the submission files and the executable will have to reside on the CANFAR batch login node. Connect to the batch node with your CANFAR username (refered as`[username]`):

{% highlight bash %}
ssh [username]@batch.canfar.net
{% endhighlight %}

Then you will need to source your credentials to access your tenant's VMs:

{% highlight bash %}
. canfar-[tenant]-openrc.sh
{% endhighlight %}

This file is the same as the one you can download from your tenant, when clicking in the **API Access** tab from your [dashboard](https://west.cloud.computecanada.ca/dashboard/project/access_and_security/). It should download it for you, then replace `[tenant]` by your tenant name.
Now to submit the job, there is a special wrapper script that will share your VM with CANFAR, add some boiler plate lines for the cloud-scheduler, validate and submit the job. Instead of running `condor_submit`, you would run `canfar_submit`. For our simple example, you would do:
{% highlight bash %}
canfar_submit myjob.jdl my_vm_image c8-30gb-380
{% endhighlight %}


### Checking Job Status
`HTCondor` offers a great deal of command line tools to check the status of the VM and the job. Below is a basic list of typical HTCondor commands for job management. For a more exhaustive list of commands, we refere the reader to the official [HTCondor user documentation](http://research.cs.wisc.edu/htcondor/manual/v8.4/2_Users_Manual.html) or a good overview and cheat sheet on [SIEpedia](http://www.iac.es/sieinvens/siepedia/pmwiki.php?n=HOWTOs.Condor).

Check the status of the global queue:

{% highlight bash %}
condor_status -submitter
{% endhighlight %}

Check the status of your jobs

{% highlight bash %}
condor_q [username]
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

