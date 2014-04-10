This is the Quick Start guide to creating and configuring a VM. For more details see: [In Depth Configuration](In Depth Configuration "wikilink")

**WARNING: Instead of this system, you might want to use the prototype configuration system. For the reason why see: [Protoype vs. Nimbus Configuration](Protoype vs. Nimbus Configuration "wikilink")**

Log in to the canfar configuration host:

    ssh canfar.dao.nrc.ca

Create a VM named myvm. The VM name you use here is also referred to as the 'VMType'.

    vmcreate myvm

An email containing information about your VM will be sent to you. Wait for this email, then ssh to your VM with the IP in the email. You can check the IPs of your running VMs by listing the running ones:

    vmlist

You should see something like:

    IP Address        VM Type        URL
    172.22.128.1      myvm       http://gimli2/vmrepo/minimal_SL55_3G.img
    172.22.128.10     myvm2      https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/canfar/vmrepo/minimal_SL55_3G.img

    ssh 172.22.128.1 (or whatever the IP was)

There is also a very simple wrapper to connect your VM:

    vmssh myvm

Set up your software (examples in <Astronomy_Software>). You have root privileges. Just prefix each command with sudo: e.g.

    sudo yum install emacs

or, to build and install any software or data of your choice. Remember your VM has a life time given on the email, so keep stop/start cycle. Once you're done installing, shutdown your VM which will save it. A copy of the currently configured system is made.

    vmstop myvm

Again, it will take a few minutes to shutdown, and save it to your VOSpace as myvm.img.gz. Save your VM 'every so often' to protect against loss of data, at least once a day.

To configure your VM some more, run vmlist to get the IP, then to start your VM:

    vmstart myvm

And wait for the email for the IP address as before. Do not use create to start your VM again. You have scratch space on /staging to work with automatically mounted.

Try one fast job. Once it runs with no human intervention, you are done.

Now you are ready for processing shutdown the VM and move on to the next step: [Processing](Quick_Start_Processing "wikilink").
