Introduction
------------

This is the detailed guide to creating and configuring a Virtual Machine. We also have a [Quick Start Configuration](Quick Start Configuration "wikilink") Guide.

At this time all CANFAR VMs are based on Scientific Linux 5.5

You can also use <VMSharing> as a way of speeding your configuration, say for SCUBA-2 processing.

Before getting into the details, it is worth understanding what a Virtual Machine (VM) is and why they were chosen for the CANFAR processing system. The VM system can be thought of like this: we give you a laptop. You install your software on the laptop and make sure it works. You give us back the laptop. We take that laptop and put it in storage. When you want to run your jobs, we take that laptop out and clone it a 100 times and boot all the laptops. Your jobs run on the clones, 100 times faster than if they were running on a single laptop.

The VM is physically stored as a single file, known as a disk image. Their file extension is ".img" and they usually are several GB in size. Image files can also be gzipped, in which case their extension is ".img.gz". Gzipped files are the default.

The image file contains all the directories and files of your system. This file can be copied, saved, and written like a normal file. When you start your VM, this file is remotely copied over to a physical computer and the VM is booted on that machine.

The steps for configuring a VM are:

-   **create the VM:** This causes the image file to be created. The new VM is a bare bones operating system with little extra software installed.
-   **start your VM:** This boots your VM. The image file is copied from storage to a physical computer, the virtualization host.
-   **install your software**
-   **test your software**
-   **stop your VM:** This shutdowns the VM and copies the now modified image back to storage. It is the equivalent of saving your edits.

In actual practice, most people go through several iterations of start/install/test/stop. Because stop=save, you should probably stop relatively often. The saving processing is only 99% reliable at present, so scripts and software specific to the VM should probably be backed up somewhere else. The easiest way to do it is to use a versioned control system on another computer. Also the start/stop cycle takes several minutes. Balance the possible annoyance of losing your changes with the definite annoyance of having to wait.

By default, the VM will only be booted for approximately 36 hours after a create or start request. Once that time expires, the VM will be shut down. Also by default, changes will be saved back to the file that was used to boot it. So if you create a VM, and allow the VM to expire, you will lose any changes you have made to the VM if it expires befaure you shut it down. Optimally, create a VM, log in to make sure the ssh keys are correct, stop that VM to save it to your VOSpace, and then start the VM from your VOSpace.

Before you start
----------------

**Get a CANFAR processing account:** This account is not the same as your CADC account, nor is it the same as a VOspace account. Send an e-mail to canfarhelp@nrc.ca indicating the kind of processing you want to do (time estimates, number of CPUs per job, memory requirements) and a very brief description of the science goals. If we need more information, we'll contact you. It can take a week to get your account.

**Plan your processing:**

-   Remember that when the VMs are running in batch mode, they are completely non-interactive.
-   Remember that the VM can take 5 minutes to transfer between host and storage, and boot. Although multiple jobs will run on one VM, few big jobs are better than many small jobs.
-   The fewer resources you ask for, the more frequently a VM will be available and your jobs will run. If your code will only run on a 8CPU 64GB machine, that's fine. But if the code can be easily modified to run on a less powerful machine, you may have better luck aiming for a large number of smaller machines.
-   Remember that the CANFAR VM processing system offers job level parallelism only; jobs can't talk to each other.

Starting and logging on to the VM
---------------------------------

This section explains how to actually create and start the VM. First log in to the canfar configuration host:

    ssh canfar2.dao.nrc.ca

You will need to create ssh keys so that you can log into your VM once it is up and running (if you are unfamiliar with SSH, please see the links in our <Quick_Start_SSH>). To create a new VM, execute the following:

    $ vmcreate -u <cadc username> -p <cadc password>
    [--proxy-life <number in days>] 
    [--vm-size <number in GB>] 
    [--cores <number of cores>] 
    [--ram <number in GB>] 
    [--disk=<number in GB>] <VMtype>

The VMType parameter is used to reference this VM in further configuration and in processing.

A shortcut, if you have a .netrc file, and want a 6GB image size, is:

    vmcreate <VMtype> 

There will be a brief pause for initial checks, then if the start is successful, you will see something like:

    The initial parameters checks look good.  A VCE of size [%s] is booting now.  An email will be sent to the address 
    [email address from CADC account] informing you of the IP Address when the virtual machine is ready.

Then wait for the email to appear. This will have an IP address for your VM. It will look something like 123.20.20.12.

Should the email contain error messages, it's likely the CANFAR helpdesk has received the same email, but it never hurts to forward the message to canfarhelp@nrc.ca.

Assuming nothing went wrong, at this point your newly created VM is running and is available at the IP address in the email. Everytime you create a new VM or start your VM for further editting it will be assigned a random IP address, so you don't need to recall this IP address beyond this session. If you have a running VM, you can find its IP using the 'list' option:

    vmlist [-u <cadc username>]

Again, --username is optional if you have a .netrc file or if your CADC username matches your CANFAR one. You should get something like:

    IP Address        VM Type        URL
    172.22.128.1      new_proc       http://gimli2/vmrepo/minimal_SL55_3G.img
    172.22.128.10     new_proc2      https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/canfar/vmrepo/minimal_SL55_3G.img

You can then log on to the VM with `ssh`:

    ssh 123.20.20.12

(Replace 123.20.20.12 with whatever was in the email message.) You can only log on to the VM from canfar2.dao.nrc.ca.

To restart an existing VM, type:

    vmstart -u <cadc user name>  -p <cadc password> 
    [--proxy-life <number in days>] 
    [--cores <number>] 
    [--memory=<number in GB>] 
    [--disk <number in GB>] <VMtype>

The shortcut, if you have a .netrc file and a VOSpace with your username, is:

    $ vmstart <VMtype> 

You should get something like:

    An email will be sent to the address [email address with cadc account] with the IP Address 
    for connection, once the VCE has booted correctly.

And wait ........ for the email with the IP address as before. Do not use `vmcreate` to start your VM again. This creates a new VM, it doesn't start your old one.

If you have lost the IP address of a running VM, list your VMs again. This time, you should get something like:

    IP Address        VM Type        URL
    172.22.128.1      vm_type1       http://gimli2/vmrepo/minimal_SL55_3G.img
    172.22.128.10     vm_type2       https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/canfar/vmrepo/minimal_SL55_3G.img

You should be able to login to the VM with the IP address with `ssh`. See the [SSH Help](SSH Help "wikilink") for more info. There is also a very simple wrapper to ssh to your VM once it is booted:

    vmssh <VMtype>

Installing software
-------------------

Now login to your VM:

    ssh 123.20.20.12 (or whatever the IP from the previous step was)

You are the owner of the VM, and are responsible for it. To use your administration priviledges, prefix the command with sudo. For example, if you want to edit the message of the day, you would run:

    sudo nano /etc/motd

The base VM is currently based on [Scientific Linux](http://www.scientificlinux.org/) (SL), a Linux RedHat Enterprise clone. The current version is 5.5 and is 64 bits (x86\_64). To install standard linux packages, the package manager is [yum](http://fedoraproject.org/wiki/Tools/yum) which is a wrapper around rpm with resolved dependencies. For example, to install emacs, use the simple command:

    sudo yum install emacs

The VM does not come with X11, which some users might need if they want to install sofwtare that uses a GUI for installation. To get a basic X11 install try:

    sudo yum install xterm xauth

Now if you log into your VM using *ssh -X canfar2.dao.nrc.ca* and then *ssh -X <VM IP> xterm* you should get an xterm to display through to your local desktop.

Try to install as many software packages as you need with yum or rpm. It will make things much more manageable for you in the future. Remember rpm can also install local or remote RPM files:

    sudo rpm -i http://www.astromatic.net/download/swarp/swarp-2.19.1-1.x86_64.rpm

You can also look for a package if you know a command or an installed file:

    yum whatprovides libtool

Also you can search the installed yum repositories:

    yum search <some package name>

and if it is not available in the default repositories, it might be available in an external one. See the [SL documentation](http://www.scientificlinux.org/documentation/faq/yum.apt.repo) on how to add repositories. If not available in a yum repository, try searching for the rpm on the internet. Now you will probably have some software not available as RPM packages, so you will need to of install it locally. Some software fortunately are easy to build, typically with the GNU autotools (autoconf, automake,...), for example for SExtractor:

    curl http://www.astromatic.net/download/sextractor/sextractor-2.8.6.tar.gz | tar xzf -
    cd sextractor-2.8.6
    ./configure
    make
    sudo make install

(note that you only need root privileges for the last step). It will install the software in the default "prefix" directory /usr/local, which can be changed with at the `./configure` command.

How to install \*your\* specific software is outside the scope of this guide, however here a few suggestions:

-   We have a list of some astronomy packages and their install procedures: [Astronomy Software](Astronomy Software "wikilink"). Feel free to edit that page with your own software so that everyone can benefit from it
-   Remember you are responsible for the software you install and especially its license, so using commercial software is at your own risk.

Once all necessary software is installed, shut down your VM to save your changes. The vm reference is obtained from the output of the "vmlist", and the url parameter is where your VM will be saved to:

    vmstop [-u=<cadc user name> -p=<cadc password> --url=<full url where to save the vm>] <VMtype>

The shortcut, if you have a .netrc file, will save the image file in vos://cadc.nrc.ca\~vospace/<cadc username>/<VMtype>.img.gz:

    vmstop <VMtype>

Again, it takes a few minutes to shutdown. Just logging out does not shutdown the VM. An email will be sent to your CADC user email address when the shutdown is complete, so that you will know when it is safe to use the VM for batch job submission.

In order to run your VM with the last software you installed, you must shutdown the VM. There is tendency to leave VMs running for long periods of time when you are configuring; avoid this. If you aren't actively configuring, shutdown the VM. This frees up resources for other users.

Also, configuration VMs do not have an infinite life-span. If a configuration VM has been running for longer than a week, it will be automatically shut down. If the configuration job was the result of a "create" action, **all changes will be lost**. If the configuration job was the result of a "start" action, changes to the VM will be saved back to the URL provided as part of the vcetoolcl execution.

You can check that your VM has shut down with "vmlist" action, you should see "No running domains found".

Testing your software
---------------------

If your VM is shut down, start it up again. You can test your software on the VM using /staging as a scratch space. This scratch space is automatically mounted.

Even if your jobs don't need a lot of scratch space, that's where they will be running when they are in batch mode. Data in /staging is wiped out when the VM shuts down, so do not leave anything important on it. When you use scratch space within your scripts, refer to it as the environment variable TMPDIR, which will be understood by condor batch processing e.g., in bash: `export TMPDIR=/staging`

Note that your software is responsible for getting the input data on to the VM (from the CADC, from VOspace or from your home institution) and the output off your VM (either to VOspace or to your home institution). Don't put data in the VM unless it is very small. As very simple example script called mydemo.bash would be:

    #!/bin/bash
    cd ${TMPDIR:-/staging}
    wget -q -O ${1}.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&asf=true&file_id='${1}
    funpack  ${1}.fits.fz
    cp ~/sextractor-2.8.6/config/default.* .
    sex $1.fits -CATALOG_NAME $1.cat -VERBOSE_TYPE QUIET
    java -jar ~/lib/cadcVOSClient.jar --copy \
         --src=${1}.cat --dest=vos://cadc.nrc.ca~vospace/<cadc username>/${1}.cat

This script assumes you have funpack and the VOSpace client are installed on the VM. If you then type:

    chmod u+x mydemo.bash
    ./mydemo.bash 1056213p

it would retrieve the file 1056213p from the CADC CFHT archive, uncompress it, run SExtractor on it and copy the results to your VOSpace.

Try one fast job. Once it runs with no human intervention, you are done. Shutdown the VM and move on to the next step: [In Depth Processing](In Depth Processing "wikilink") Note the first line: it changes directory. When condor launches a job, it will by default execute the job from the \$TMPDIR directory, which changes with each VM instance. So if you want to do it from your home directory, you will have to change directory first. The "cd \${TMPDIR:-/staging}" bit is just saying "change to \$TMPDIR if defined and to /staging if \$TMPDIR is not defined.

More on VM management
---------------------

You can always use one of the VM management command with the `--help` option:

-   `vmlist`: list VMs
-   `vmstart`: start a VM
-   `vmcreate`: create a new VM
-   `vmstop`: stop and save a VM
-   `vmssh`: connect to a VM
-   `vmtool`: general tool to do all the above

Tips
----

-   Set up your ssh keys fairly early on to avoid having to type your password. Particularly in the beginning, you will be doing a lot of software copying from your home institution. Use ssh-agent or keychain on canfar2.

-   Add /usr/cadc/local/scripts to your path on the CANFAR host so you can type "vmlist" instead of /usr/cadc/local/scripts/vmlist

-   Create a log directory in VOSpace, and have your jobs redirect STDOUT and STDERR to a log file (with a unique name based on the TASK\_NAME) that you send over to VOSpace. This makes debugging much easier.

-   Do not use background jobs in your executable scripts (i.e. commands ending with '&').

-   Out of politeness, if you are not going to configure your VM for a few hours, shut it down. This frees up resources for other users.

