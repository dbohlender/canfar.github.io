This is the Quick Start guide to creating and configuring a VM using the prototype. For more details see: [In Depth Configuration Prototype](In Depth Configuration Prototype "wikilink")

**NOTE: This system is becoming obsolete. You might want to use the [new system](Quick Start Configuration "wikilink"). For the reasons why see: [Protoype vs. Nimbus Configuration](Protoype vs. Nimbus Configuration "wikilink")**

Log in to the canfar configuration host:

    ssh canfar.dao.nrc.ca

Create your .ssh keys:

    ssh-keygen -t rsa

Start the VM management tool: vcetool:

    /usr/cadc/local/scripts/vcetool

From the vcetool shell, create a VM:

    $ create my_vm_name

Watch the dots....... for several minutes. Then you will get an IP address for your VM. It will look something like 123.20.20.12. Exit the vcetool with:

    $ quit

Login to your VM:

    ssh 123.20.20.12 (or whatever the IP was)

Set up your software. You have root privileges. Just prefix each command with sudo: e.g.

    sudo yum install emacs

or, to build and install standard GNU style packages something like:

    ./configure
    make
    sudo make install

Save your changes. When you shutdown your VM, a copy of the currently configured system is made. Save your VM 'every so often' to protect against loss of data, at least once a day. Do this by shutting it down:

    sudo /sbin/shutdown -h now

Again, it will take a few minutes to shutdown.

To configure your VM some more, run the vcetool again. You need your VM number, not the VM name. At the vcetool prompt, type:

    $ list

You should see something like:

     $ VCE ID       Is Running      IP Address              VCE Name
    50000000000053821       true            172.18.20.132           my_vm_name

To start your VM:

    $ start 50000000000053821

And wait for the dots again........ for the IP address as before. Do not use create to start your VM again. This creates a new VM, it doesn't start your old one.

If you need scratch space on the VM, you need to mount it during configuration. Log on to the VM and run:

    sudo mount -t ext2 /dev/sda1 /staging

Try one fast job. Once it runs with no human intervention, you are done.

Change the default VMType to your VM\_ID by editing the file: /etc/condor/condor\_config.local Remember you have to edit this file as root:

    sudo emacs /etc/condor/condor_config.local

Look for the line:

    VMType = "canfarbase"

change this to your VM ID number (the one that starts with 50000...) for example:

    VMType = "50000000000053821"

The quotes are required.

<my_vm_ID> is the number starting with 50000...

Now you are ready for processing shutdown the VM and move on to the next step: [Processing](Quick_Start_Processing "wikilink")
