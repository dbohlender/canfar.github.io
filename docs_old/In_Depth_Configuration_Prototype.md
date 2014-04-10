Introduction
------------

This is the detailed guide to creating and configuring a Virtual Machine using the prototype configuration system. We also have a [Quick Start Configuration](Quick Start Configuration "wikilink") Guide.

**NOTE: This system is becoming obsolete. You might want to use the [new system](In Depth Configuration "wikilink"). For the reasons why see: [Protoype vs. Nimbus Configuration](Protoype vs. Nimbus Configuration "wikilink")**

At this time, all CANFAR VMs are based on Scientific Linux 5.5

You can also use <VMSharing> as a way of speeding your configuration, say for SCUBA-2 processing.

Before getting into the details, it is worth understanding what a Virtual Machine (VM) is and why they were chosen for the CANFAR processing system. The VM system can be thought of like this: we give you a laptop. You install your software on the laptop and make sure it works. You give us back the laptop. We take that laptop and put it in storage. When you want to run your jobs, we take that laptop out and clone it a 100 times and boot all the laptops. Your jobs run on the clones, 100 times faster than if they were running on a single laptop.

The VM is physically stored as a single file, known as a disk image. Their file extension is ".img" and they are several GB in size. It contains all the directories and files of your system. This file can be copied, saved, and written like a normal file. In normal operations, you never see this file. When you start your VM, this file is copied over to a physical computer and the VM is booted on that machine.

The steps for configuring a VM are:

-   **create the VM:** This causes the image file to be created. The new VM is a bare bones operating system with little extra software installed.
-   **start your VM:** This boots your VM. The image file is copied from storage to a physical computer, the virtualization host.
-   **install your software**
-   **test your software**
-   **shutdown your VM:** This also copies the now modified image back to storage. It is the equivalent of saving your edits.

In actual practice, most people go through several iterations of start/install/test/shutdown. Because shutdown=save, you should probably shutdown relatively often. The saving processing is only 99% reliable at present, so scripts and software specific to the VM should probably be backed up somewhere else. The easiest way to do it is to use a versioned control system on another computer. Also the shutdown/start cycle takes several minutes. Balance the possible annoyance of losing your changes with the definite annoyance of having to wait.

Before you start
----------------

**Get a CANFAR processing account:** This account is not the same as your CADC account, nor is it the same as a VOspace account. Send an e-mail to canfarhelp@nrc.ca indicating the kind of processing you want to do (time estimates, number of CPUs per job, memory requirements) and a very brief description of the science goals. If we need more information, we'll contact you. It can take a week to get your account.

**Plan your processing:**

-   Remember that when the VMs are running in batch mode, they are completely non-interactive.
-   Remember that the VM can take 5 minutes to transfer between host and storage, and boot. Few big jobs are better than many small jobs.
-   The fewer resources you ask for, the more frequently a VM will be available and your jobs will run. If your code will only run on a 8CPU 64GB machine, that's fine. But if the code can be easily modified to run on a less powerful machine, you may have better luck aiming for a large number of smaller machines.
-   Remember that the CANFAR VM processing system offers job level parallelism only; jobs can't talk to each other.

Starting and logging on to the VM
---------------------------------

This section explains how to actually create and start the VM. First log in to the canfar configuration host:

    ssh canfar.dao.nrc.ca

You will need to create ssh keys so that you can log into your VM once it is up and running (if you are unfamiliar with SSH, please see the links in our [[Quick\_Start\_SSH][SSH help page]]. Create your .ssh keys using:

    ssh-keygen

Next, start the vcetool. This program has a number of commands, many of which are obsolete. Only four are relevant to you:

-   **create *my\_vm\_name***: creates a VM named *my\_vm\_name* and boots the new VM
-   **start *vm\_id***: boots a VM with an existing identification number
-   **list**: lists all the VMs you own
-   **quit**: exits vcetool (or you can use Ctrl-c)

VMs have names and IDs. The name can be anything you like (eg. "Lensing1"). The ID is a long, unique number (eg. 50000000000060777).

To start vcetool type:

    /usr/cadc/local/scripts/vcetool

To create a new VM, from the vcetool prompt, where you give it a name. Take a name that describes what the VM will do

    $ create vm_name

(Replace *vm\_name* with your own label for the VM.) Watch the dots....... for several minutes. Then you will get an IP address for your VM. It will look something like 123.20.20.12. Don't lose it. Should the vcetool come back with an error message like, "Cannot locate IP Address for running VM.", then the system was too slow in booting the VM for the vcetool to locate it. The vcetool waits three minutes, then gives up polling for an IP Address. Eventually, it will report an IP address if you keep monitoring it with the 'list' command. If it takes more than 10 minutes, something went wrong. Send an e-mail to canfarhelp@nrc.ca

Assuming nothing went wrong, then at this point your newly created VM is running and is available at the IP address that was returned from the 'create' command. Everytime you create a new VM or start your VM for further editting it will be assigned a random IP address, so you don't need to recall this IP address beyond this session. If you have a running VM, you can find its IP using the vcetool 'list' command (below).

Now exit vcetool:

    $ quit

You can then log on to the VM with `ssh`:

    ssh 123.20.20.12

(Replace 123.20.20.12 with whatever the create command returned.) You can only log on to the VM from canfar.dao.nrc.ca.

To restart an existing VM, start vcetool on the canfar login host again and then type:

    $ list

You should get something like:

    VCE ID  Is Running      IP Address              VCE Name
    50000000000060777       false           n/a                     groucho1

If the IP Address field is 'n/a', then your VM is not running. You can start it by using:

    start 50000000000060777

And wait ........ for the IP address as before. Do not use `create` to start your VM again. This creates a new VM, it doesn't start your old one.

If you have lost the IP address of a running VM, list your VMs again. This time, you should get something like:

    VCE ID  Is Running      IP Address              VCE Name
    50000000000052243       true            172.20.21.163           groucho1

You should be able to login to the VM with the IP address.

Change the VMtype
-----------------

You need to give a "type" to your VM for the cloud scheduler to keep track of it. The type is kept on the file /etc/condor/condor\_config.local. Edit and change the "VMType" parameter to something unique. The best idea so far is to give the VM id number. The default is "canfarbase". Remember you have to edit this file as root. From within your VM:

    sudo emacs /etc/condor/condor_config.local

Look for the line:

    VMType = "canfarbase"

change this to your VM ID number (the one that starts with 50000...) for example:

    VMType = "50000000000053821"

The quotes are required.

Installing software
-------------------

Now login to your VM:

    ssh 123.20.20.12 (or whatever the IP from the previous step was)

You are the owner of the VM, and are responsible for it. To use your administration priviledges, prefix the command with sudo. For example, if you want to edit the message of the day, you would run:

    sudo nano /etc/motd

The VM is currently based on [Scientific Linux](http://www.scientificlinux.org/) (SL), a Linux RedHat Enterprise clone. The current version is 5.5 and is 64 bits (x86\_64). To install standard linux packages, the package manager is [yum](http://fedoraproject.org/wiki/Tools/yum) which is a wrapper around rpm with resolved dependencies. For example, to install emacs, use the simple command:

    sudo yum install emacs

The VM does not come with X11, which some users might need if they want to install sofwtare that uses a GUI for installation. To get a basic X11 install try:

    sudo yum install xterm
    sudo yum install xauth

or

    sudo yum groupinstall 'X Window System'

Now if you log into your VM using *ssh -X canfar.dao.nrc.ca* and then *ssh -X xx.xx.xx.xx* you should get an xterm to display through to your local desktop.

Try to install as many software packages as you need with yum or rpm. It will make things much more manageable for you in the future. Remember rpm can also install local or remote RPM files:

    sudo rpm -i ftp://ftp.iap.fr/pub/from_users/bertin/swarp/swarp-2.17.6-1.x86_64.rpm

You can also look for a package if you know a command or an installed file:

    yum whatprovides libtool

Also you can search the installed yum repositories:

    yum search <some package name>

and if it is not available in the default repositories, it might be available in an external one. See the [SL documentation](http://www.scientificlinux.org/documentation/faq/yum.apt.repo) on how to add repositories. If not available in a yum repository, try searching for the rpm on the internet. Now you will probably have some software not available as RPM packages, so you will need to of install it locally. Some software fortunately are easy to build, typically with the GNU autotools (autoconf, automake,...), for example for SExtractor:

    wget http://www.astromatic.net/download/sextractor/sextractor-2.8.6.tar.gz
    tar -xf sextractor-2.8.6.tar.gz
    cd sextractor-2.8.6
    ./configure
    make
    sudo make install

(note that you only need root privileges for the last step). It will install the software in the default "prefix" directory /usr/local, which can be changed with at the `./configure` command.

How to install \*your\* specific software is outside the scope of this guide, however here a few suggestions

-   Some astronomers need IRAF. It is sufficiently hard to install, that it has own specific page: [Installing IRAF](Installing IRAF "wikilink").
-   Some of the more common astronomy packages have a reasonably simple and stable install procedure. There is a list of such packages and their install procedures: [Astronomy Software](Astronomy Software "wikilink").
-   Remember you are responsible for the software you install and especially its license, so using commercial software is at your own risk.

When all necessary software is installed, shut down your VM to save your changes:

    sudo /sbin/shutdown -h now

Again, it take a few minutes to shutdown. Just logging out does not shutdown the VM. In order to run your VM with the last software you installed, you must shutdown the VM. There is tendency to leave VMs running for long periods of time when you are configuring; avoid this. If you aren't actively configuring, shutdown the VM. This frees up resources for other users. You can check that your VM has shut down with vcetool. If you do a "list", you should see "False" in the "IsRunning" column.

Testing your software
---------------------

If your VM is shut down, start it up again. You can test your software on the VM using /staging as a scratch space. This scratch space is automatically mounted during batch processing, but for a live VM session, you need to mount it by hand. To access /staging mount it as root with the following commands:

    sudo mount -t ext2 /dev/sda1 /staging
    sudo chown <my_username>:<my_username> /staging

Even if your jobs don't need a lot of scratch space, that's where they will be running when they are in batch mode. Data in /staging is wiped out when the VM shuts down, so do not leave anything important on it. When you use scratch space within your scripts, refer to it as the environment variable TMPDIR, which will be understood by condor batch processing e.g., in bash: `export TMPDIR=/staging`

Note that your software is responsible for getting the input data on to the VM (from the CADC, from VOspace or from your home institution) and the output off your VM (either to VOspace or to your home institution). Don't put data in the VM unless it is very small. As very simple example script called sexdemo.bash would be:

    #!/bin/bash
    cd ${TMPDIR:-/staging}
    wget -q -O ${1}.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&asf=true&file_id='${1}
    funpack  ${1}.fits.fz
    cp ~/sextractor-2.8.6/config/default.* .
    sex $1.fits -CATALOG_NAME $1.cat -VERBOSE_TYPE QUIET
    java -jar ~/lib/cadcVOSClient.jar --copy \
         --src=${1}.cat --dest=vos://cadc.nrc.ca~vospace/${USER}/${1}.cat

This script assumes you have funpack and the VOSpace client are installed on the VM. If you then type:

    chmod u+x sexdemo.bash
    ./sexdemo.bash 1056213p

it would retrieve the file 1056213p from the CADC CFHT archive, uncompress it, run SExtractor on it and copy the results to your VOSpace.

Try one fast job. Once it runs with no human intervention, you are done. Shutdown the VM and move on to the next step: [In Depth Processing](In Depth Processing "wikilink")

Tips
----

-   Set up your ssh keys fairly early on to avoid having to type your password. Particularly in the beginning, you will be doing a lot of software copying from your home institution. Use ssh-agent or keychain on canfar.

-   Add /usr/cadc/local/scripts to your path on the CANFAR host so you can type "vcetool" instead of /usr/cadc/local/vcetool"

-   Create a log directory in VOSpace, and have your jobs redirect STDOUT and STDERR to a log file (with a unique name based on the TASK\_NAME) that you send over to VOSpace. This makes debugging much easier.

-   Of course, your job may fail before you get to the redirect. Go through /home/canfrops/prototype/logs/domain-exec.log looking for lines like: sudo -u . The next few lines after that entry are often pretty helpful if your job failed right away.

-   Do not use background jobs in your executable scripts (i.e. commands ending with '&').

-   Out of politeness, if you are not going to configure your VM for a few hours, shut it down. This frees up resources for other users.

