CANFAR processing consists of booting a Virtual Machine (VM) and running an executable on the VM with given arguments. Many VMs can be booted simultaneously in a batch manner and will be spread out through the CANFAR network on various clusters. The job control is handled with a package called "condor". The VMs in turn are managed by a program called "CloudScheduler". When you submit a job, CloudScheduler checks the condor queue to see if one of your VMs is booted. If it isn't, CloudScheduler boots the VM. After the job runs, your VM waits a while in case another one of your jobs is queued. If it isn't, it shuts down.

Resources available
-------------------

A list of resources can be found on this page [Computing\_Resources\_Available\_to\_CANFAR]

Submitting jobs
---------------

You are (hopefully) done with configuring and testing the VM for now. It is time to run it and spread it all over the cloud to complete your jobs. CANFAR uses [condor](http://www.cs.wisc.edu/condor/) to submit and monitor jobs. Internally the scheduling is done by both condor and the [cloud scheduler](http://cloudscheduler.org/). In order to schedule the submitted jobs, the cloud schedule requires a submission file. The syntax for the submission file follows the [condor syntax](http://www.cs.wisc.edu/condor/manual/v7.6/2_5Submitting_Job.html) and adds a few configuration options that are required by the [cloud scheduler](https://github.com/hep-gc/cloud-scheduler/wiki/Submitting-a-Job-for-Cloud-Scheduler). The submission file is described in more detail below.

When you submit a job to be executed, you do so from your submission host (ie. from a directory on canfar.dao.nrc.ca). This will boot and run your job on your cloned VM. In order to do this, you must first copy the main executable file that you just ran and tested on the VM itself to your submission host. When you submit a job from your submission host and your job runs, it will copy the executable file from the submission host to the cloned VM and run there. The main executable file is the file that you will be running over and over again, but with different arguments. It can be a short shell script, a longer perl/python script, a compiled program, whatever, but it is the only thing that is actually going to be run during a job execution. Note that if a command exists with the same name on the VM, it will be ignored. For example, if your main executable is called "astro.pl", condor will look for a copy of astro.pl on canfar.dao.nrc.ca. Even if astro.pl exists on the VM, is in the right path and is set to executable, it won't be run. The copy of "astro.pl" will be copied over from canfar.dao.nrc.ca. Note, this is the only thing that will be copied. If astro.pl calls any other programs, the program on the VM will be run.

#### The submission script

The condor 'Requirements' option takes special syntax and the attributes beginning with '+VM' are cloud scheduler specific. On CANFAR, we still have a few limitations on hardware requirements mentioned on the submission template file given below. Here is the template:

And here is an example:

A few remarks about the submission file: There three sets of parameters: the condor parameters (which specify what the job needs to run), the VM parameters (which specifiy what kind of VMs will be booted) and the job parameter (which control the input and output of each job).

##### Condor parameters

-   **Executable = <my_process_script>**. This file has to be written and be located on the submission host, with the value of the relative path of the process script from the submission directory. It is often a simple wrapper calling the executable on the VM. It will be copied over by condor from the submission to the VM, so everything needs to relate to the VM environment. Here's an example for this script, where the path in the script is valid on the VM:

<!-- -->

    #!/bin/bash
    source /home/gwyn/.bashrc
    /home/gwyn/astro.pl $@

(assuming your name is gwyn and the job you want to run on the VM is called astro.pl)

-   **Universe** Always Vanilla
-   **Log** This is the file that condor will write information about the jobs activities. It always appended to, never overwritten.
-   **getenv = True**. This copies over the values of the environment variables from the submission host to the VM. The environment while your jobs are running will be the same as the environment when you submitted your job. In particular you should make sure PATH is set correctly.
-   **notification** and **notify\_user**: You almost certainly don't want to be notified.
-   **should\_transfer\_files = YES**. It must be set this way, or else a job will never match a provisioned VM, and will never run. Look [here](http://www.cs.wisc.edu/condor/manual/v7.6/3_3Configuration.html#sec:Shared-Filesystem-Config-File-Entries) for details. Add `transfer_output_files = /dev/null` if there's nothing that you need Condor to transfer at the end of job execution. If you don't set it to /dev/null, files will be transferred to the CANFAR submission host. This is OK if there are only a small number of small files. That is, all files created or edited in the \$TMPDIR will be copied back to canfar host in the directory from which the jobs were submitted. If you want to specify a small of files to copy back, specify them individually in a comma-delimited list. For example: ` transfer_output_files = file_I_need.1, file_I_need.2 ` If however, you have a large volume of files to copy, you're better off sending things to VOspace.
-   **RunAsOwner = True**. Otherwise the job will run as nobody.
-   **Requirements:**
    -   VMType: always the same value you put in to /etc/condor/condor\_config.local on the VM
    -   Arch: always
    -   Memory: in MB. Make this as small as you can
    -   CPUs: Set to 1 unless you need more. The current maximum is 6.

If more subtle environment manipulation is needed, see the condor manual [<http://www.cs.wisc.edu/condor/manual/v7.6/condor_submit.html>\# here] and [here](http://www.cs.wisc.edu/condor/manual/v7.6/2_5Submitting_Job.html).

-   **Queue**. Every Queue statement in a job submission file is a job. It's more efficient to do one condor\_submit on a file with many entries than one condor file for each entry.

##### VM parameters

These are the parameter that control the kind of VM that will be booted:

-   **+VMCPUArch**: always "x86"
-   **+VMLoc**: URL to the VM. This a file that contains your VM. This controls which VM will be booted.
-   **+VMMem**: must be the same as Memory (above)
-   **+VMCPUCores**: must be the same as Cpus (above)
-   '''+VMStorage ''': specifies the amount of storage (in Gb). Make it as small as you can get away with.

##### Job parameters

-   **Arguments** These are the command line arguments to your script.
-   **Output and Error**. This is where STDOUT and STDERR are written. When the job is submitted, they will get created as zero-length files. When the job ends, they will contain everything written by the VM executable. They can be mixed in the same file.
-   **Queue**. Every Queue statement in a job submission file is a job. It's more efficient to do one condor\_submit on a file with many entries than one condor file for each entry.

#### Job submission

To submit the jobs: log onto canfar.dao.nrc.ca, write a condor file as described above with its corresponding process script, and launch the command:

    condor_submit <my_job_process.sub>

Monitoring the jobs
-------------------

One thing to remember is the overhead time needed for each VM to transfer, uncompress and boot. On a completely unoccupied cluster, it will take about 15 minutes for the first VM to boot, join the condor pool, and start executing jobs. On an occupied cluster, it will take longer (\~25 minutes is current wisdom). So there is little need for a VM to run a 5 min job, and patience is key.

Reaching the condor pool can only be done from canfar.nrc.dao.ca. Run the condor commands from there. The following is a list of the most useful commands:

#### Monitor the full job queue

To list all the jobs in the condor queue, simply run: `
condor_q
` It will show something like:


    -- Submitter: localhost.localdomain : <204.174.103.112:9618> : localhost.localdomain
     ID      OWNER            SUBMITTED     RUN_TIME ST PRI SIZE CMD               
     902.17  gwyn            4/18 16:07  15+16:46:34 R  0   1953.1 do12.pl do12.00018
     902.29  gwyn            4/18 16:07  15+07:39:09 R  0   1220.7 do12.pl do12.00030
     902.45  gwyn            4/18 16:07  10+23:28:27 R  0   1953.1 do12.pl do12.00046
    [snip]
    1016.0   fabbros         5/2  17:11   0+00:00:00 I  1   0.0  run_nh_sub_process
    1017.0   fabbros         5/2  17:11   0+00:00:00 I  1   0.0  run_nh_sub_process
    1018.0   fabbros         5/2  17:11   0+00:00:00 I  1   0.0  run_nh_sub_process

    2335 jobs; 2325 idle, 9 running, 1 held

All the attributes are explained on the [condor\_q](http://www.cs.wisc.edu/condor/manual/v7.6/condor_q.html) documentation. In brief, what is shown is:

|Field|What you might care|
|-----|-------------------|
|ID|Useful when querying the status of individual jobs or clusters of jobs|
|OWNER|User that submitted the jobs - for when "name and shame" is the best resource sharing strategy|
|SUBMITTED|When the job was submitted to the queue - how long a job has been waiting|
|RUN\_TIME|Total cumulative time a job has been running - jobs may be submitted for execution by condor more than once.|
|ST|Good values are R (=running), or I (=idle, waiting to run). H (=held) is usually bad.|
|PRI|Priority in the queue|
|SIZE|Memory usage|
|CMD|what's running, with parameters|
||

You can also chose to view only your own jobs:

    condor_q <username>

#### Check which VMs are booted

There are many more condor commands to learn. One other useful command is to see the current behaviour of the VMs. Do this with: `
condor_status
` It will spit out useful information. Below is an example of a typical run:

    Name               OpSys      Arch   State     Activity LoadAv Mem   ActvtyTime

    cadc-vm02          LINUX      INTEL  Unclaimed Idle     0.000  2048  0+01:18:18
    cadc-vm03          LINUX      INTEL  Unclaimed Idle     0.000  2048  0+00:55:39
    cadc-vm04          LINUX      INTEL  Unclaimed Idle     0.000  2048  0+01:25:21
    cadc-vm05          LINUX      INTEL  Unclaimed Idle     0.140  2048  0+01:27:04
    cadc-vm08          LINUX      X86_64 Unclaimed Idle     0.200  2096  0+00:00:04
                         Total Owner Claimed Unclaimed Matched Preempting Backfill

             INTEL/LINUX     4     0       0         4       0          0        0
            X86_64/LINUX     2     0       0         2       0          0        0

                   Total     6     0       0         6       0          0        0

Again, the full documentation is online at the [condor\_status](http://www.cs.wisc.edu/condor/manual/v7.6/condor_status.html) page. Here are some of the intersting values:

|Field|Origin|Why You Might Care|
|-----|------|------------------|
|Name|nimbus configuration|Interesting only to Operations|
|Arch|comes from the condor job submission description file, VMCPUArch|It should be x86\_64.|
|State|comes from condor|Interesting values are "Claimed" or "Unclaimed"|
|Activity|comes from condor|Interesting values are "Busy" or "Idle"|
|LoadAv|comes from condor|Interesting only to Operations|
|Mem|comes from the condor job submission description file, VMMem|The value is in Mb. The smaller the value, the more VMs will be able to run on a single hardware node (up to a maximum that is node-dependent).|
|ActvtyTime|comes from condor|Check this occasionally to see if your job is taking as long as you think it should to run|
||

#### Killing jobs

If jobs need killing use condor\_rm. You can kill one job, a cluser of jobs or all your jobs, as in the following 3 examples:

    condor_rm 123.12   # kills one job
    condor_rm 123      # kills a cluser of jobs
    condor_rm gmarx    # kills all jobs belong to user gmarx

Troubleshooting
---------------

-   Remember it takes a minimum of 10 minutes between submission and showing as running in with `condor_q`.
-   The most common reason that jobs don't get scheduled is that the VMType set in the condor submission file is not the same as the value as in the /etc/condor/condor\_config.local
-   The next most common reason that jobs don't run properly is that you have submitted your jobs while your configuration VM is still running, or too soon after that VM has shut down. Remember that your VM is represented by a file. When you shut down, this file gets written to disk. Until it is fully written to disk (it is a minimum of 6Gb), you can't boot your VM again, either with vmstart or with condor.
-   It is sometimes helpful to view what VMs are currently booted:

<!-- -->

    /opt/python/bin/cloud_status -m

When your VMs are being copied you should see a line like:

    ID          HOSTNAME                VMTYPE               STATUS       CLUSTER                
    1025        cadc-vm01               demo                 Unpropagated iris.cadc.dao.nrc.ca 

When your VMs are being booted you should see a line like:

    ID          HOSTNAME                VMTYPE               STATUS       CLUSTER                
    1025        cadc-vm01               demo                 Starting     iris.cadc.dao.nrc.ca 

If the VM is fully booted and running it will show up as:

    ID          HOSTNAME                VMTYPE               STATUS       CLUSTER                
    1025        cadc-vm01               demo                 Running      iris.cadc.dao.nrc.ca   

Or if it is in the error state it may show up as:

    ID          HOSTNAME                VMTYPE               STATUS       CLUSTER                
    674         cadc-vm121              photoz2              Error        cadc           

(Note that the VMTYPE is truncated. You are only seeing the last 10 characters of your VMTYPE). If the VMs start, but don't run, this indicates that the VM was not fully written to disk before it was booted.

If the VMs are in the running state for 30 minutes but your jobs don't run (condor\_q indicates that they are still in the "I" state), you probably have a mis-match in the VMType line.

If VOspace is heavily loaded, your VMs may be in the start state for a long time. This can happen for example if the queue was empty, and start 300 jobs. All your VMs will be transferring at once, cause a heavy load on the VOspace.

If your VMs are in the error state, something is wrong with the VM. You may have entered the wrong URL in your configuration file, or the VMname in the /etc/condor/condor\_config.local may different the VMname in the configuration file, or you may have an https URL, or the image file may not have public read permission. Check these. Alternatively, the VM can fail to boot due to VOspace being heavily loaded. If you see that some of your VMs are booting (in the running state), but others are in failing (in the error state), this is probably what happening. In this case, the jobs will run eventually Be patient. If your jobs still aren't running, send an e-mail to canfarhelp@nrc.ca. It helps to include some of the relevant results from cloud\_status, condor\_status and condor\_q.

Cloud Scheduler moves a VM from "Starting" to "Running" when the nimbus service moves the VM to it's version of the "Running" state. In the interval between the nimbus service knowing that a VM has changed to its "Running" state, and Cloud Scheduler finding that out from nimbus, the VM can start condor, join the pool of machines, and begin running a job. So, sometimes machines marked as 'Starting' will be accepting jobs before the cloud\_status updates to 'Running'. This is a numeral state of operations.

-   Alternatively, you may have accidentally asked for some other attribute of the VM that can't be met. Try running:

<!-- -->

    condor_q -better-analyze <your_username>

You will get something like:

        Condition                         Machines Matched    Suggestion
        ---------                         ----------------    ----------
    1   target.VMType is "demoq"          0                   MODIFY TO "5000000061657"
    2   target.Arch == "INTEL"            0                   MODIFY TO "X86_64"
    3   target.Memory >= 2048             1                    
    4   target.Cpus >= 1                  1                    
    5   ( TARGET.OpSys == "LINUX" )       1                    
    6   ( TARGET.Disk >= 1 )              1                    
    7   ( TARGET.HasFileTransfer )        1                    

kill your jobs, modify your submission script and resubmit. **Notice that the 'MODIFY' suggestions above can be very misleading.** These entries indicate that some other VM on the cloud has the above parameters, which are different from your request, but otherwise matches your request. Your job, however, will only run on your VM. Your VM is identified by your VM-type. The most common situation that occurs is that the submission request file (file sent to `condor_submit`) doesn't match the VM-type set in your VM. Diagnosing the precise issue you are having requires some experience and often a request for <Help> will get you the answer more quickly.

-   When you run `condor_submit`, if may get an error like:

<!-- -->

    ERROR: Executable file /home/gwyn/megasex.sh does not exist

Remember that the main executable must be on the canfar login host. Also, make sure you have specified the full path to the main executable in your submission script.

-   condor\_status also has a number of useful options. The following will give you the VMType of the VMs that are currently running:

<!-- -->

    condor_status -l -attributes Name,VMType

-   Jobs can take a while to die. If they are still in the "X" state half an hour later, try

<!-- -->

    condor_rm -forcex

as a last resort. See the [condor\_rm](http://www.cs.wisc.edu/condor/manual/v7.6/condor_rm.html) documentation for more.

-   Jobs can enter hold state for two reasons: Either you made an error, or cloud\_scheduler made an error.

To figure out which, run condor\_q with the -l (long) option. This produces a lot of ouput, so you should probably run it on a single job:

    condor_q -l 1203.123

If you see error messages related to cloud\_scheduler, it's not your fault. You should then release the job with `condor_release`. You can release a job, a cluster of jobs, or all your jobs:

    condor_release 1203.245
    condor_release 1203
    condor_release gwyn

Alternatively, jobs can be held due to a poorly set up condor submission file.

-   If all available resources are full, your jobs will not start until a running job finishes, freeing resources. The possible resources that might be consumed are:
    -   CPUs
    -   memory
    -   disk space

There are 300 or so slots available. If you see less than 300 jobs running, you might think that your jobs should be starting right away. It isn't that simple however. Jobs might call for more than one CPU, in which case the number of available slots will decrease. Alternatively, a job might claim enough memory on physical machine that even it isn't using all the CPUs, no other jobs can run on it. Finally, the scratch space is shared between the physical computers. If jobs claim a large amount of disk space, it is possible that new jobs will not be scheduled due to lack of disk space, even though there are CPUs and memory available.

Tips
----

#### Using the Same Data for Multiple Jobs

If you need to process the same data repeatedly and the amount of data is large (\>20G) you may find it useful to cache the data on the VM. This is not the same as putting the data into the VM during configuration. Remember that the VM doesn't shutdown after the job finishes. To cache data, put it anywhere in your VM except \$TMPDIR (which gets flushed when the job finishes); the best place is /staging. Towards the beginning of your program do you something like:

    if (/staging/mydata does not exist) {
      sudo mkdir /staging/mydata
      sudo chown myusername myusername /staging/mydata
      download the data to /staging/mydata
    } else {
      don't do anything, the data is already here.
    }

The first time the job runs on a VM, /staging/mydata will be empty. The data will get downloaded. The second time the job runs on the VM, /staging/mydata will have the necessary files in it, so it won't download anything. When the VM shuts down (either because there are no more jobs, someone else has priority over that physical machine or because a week has gone by) /staging will be erased.

#### Multiple Job Types Per User

When a user has multiple job types in the HTCondor queue, Cloud Scheduler is configured to consider what's at the head of the queue for a user in a scheduling cycle. The first item in the queue is scheduled first. Queue order is job id by default, over-ridden by job priority, if set. Until all the jobs of the lower job id (corresponding to the first job type) are scheduled, Cloud Scheduler won't boot any VMs for the higher job id, or second job type.

You may set the attribute

    +VMHighPriority = "1"

in your job submission file to indicate high priority jobs. One job will have its VM booted at high priority by Cloud Scheduler.

Why I am not getting my fair share of resources on <cluster>
------------------------------------------------------------

This analogy uses dessert type for cluster.

Cloud Scheduler tries to give each user the same amount of dessert. This is made more complicated when there are different types of dessert. Some users are fussy about eating pumpkin pie versus apple pie, and one only eats cheesecake, while the rest don't care as long as they get the same amount of dessert as everyone else.

So when User 1 shows up and only wants cheesecake Cloud Scheduler gives him all of it. User 2 and 3 show up and they're not fussy so Cloud Scheduler gives each some pumpkin and some apple. As long as there's enough pumpkin and apple for them to equal the amount of cheesecake User 1 has Cloud Scheduler is satisfied and doesn't need to take any cheesecake away from User 1.

If after Cloud Scheduler has doled out the pumpkin and apple pies to User 2 and 3 and they're looking at their plates then looking sidelong at User 1's cheesecake thinking that user has way more dessert than us, Cloud Scheduler should take a slice away from User 1 and try to split it between 2 and 3 so everyone is back to the same amount of dessert. This only happens after the apple and pumpkin are all gone.

If all the apple and pumpkin are not gone, and Users 2 and 3 have more dessert than User 1, Cloud Scheduler will not take cheesecake away from User 1.

[Processing](Category:Contents "wikilink")
