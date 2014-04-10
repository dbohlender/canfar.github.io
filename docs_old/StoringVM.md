vmstore
=======

A client to store VMs to VOSpace.

`vmstore` makes it possible to save a running VM, by rsyncing the static parts to a secondary file system partition. vmsync just executes an rsync, while vmsave executes an rsync, plus saves the zipped result to a named VOSpace.

That means you can save your working VM to a VOSpace, send batch jobs to condor using that saved VM, while still keeping your configuration VM alive. `vmstore` consists of two commands available from the VM: `vmsave` and `vmsync`.

To use vmstore
--------------

1. Log into canfar, start your VM and log into it once the email arrives:

    vmstart <vmtype>
    vmssh <vmtype>

2. To sync your running VM - this is time-consuming the first time, less so after than. Using vmsync before vmsave will make vmsave take less time. From your VM, run:

    sudo vmsync

3. To store your VM to your VOSpace, use vmsave:

    getCert
    sudo vmsave -t <vmtype> -v <vospace>

where <vmtype> is the name you want to give and <vospace> the name of the VOSpace (not the full URL). The VM will be saved as: vos:<vospace>/vmstore/<vmtype>.img.gz

4. Subsequent saves requests are shorter (replace an existing VM):

    sudo vmsave -r

5. Log out from your VM and shutdown your VM without saving it if you used vmsave:

    vmstop <vmtype>

To upgrade an existing VM to use vmstore (if your VM was created before May 24, 2013)
-------------------------------------------------------------------------------------

1.  The new vm bookeeping assumes VMs are stored in <vospace>/vmstore. If your old VM is stored in vos:<vospace>/<vmtype>.img.gz), do:

        getCert
        curl -E .ssl/cadcproxy.pem -L -d "url=https://www.canfar.phys.uvic.ca/data/pub/VOSpace/<vospace>/<vmtype>.img.gz" "https://www.canfar.phys.uvic.ca/vmod/vms"
        # wait for the value of <job id> to be returned, then use it to issue this command:
        curl -E <cert.pem> -L -d "PHASE=RUN" "https://www.canfar.phys.uvic.ca/vmod/vms/<job id>/phase"
        # wait 5 min
        vmssh <vmtype>

2.  Install software pre-requisites:

        sudo yum install python26-distribute python26-simplejson python26-argparse
        sudo easy_install-2.6 -U vos

    Update your CANFAR authentication certificate on the VM

        getCert

3.  Install the vmstore software:
        vcp vos:goliaths/vmstore-0.1.2.tar.gz .
        sudo easy_install-2.6 ./vmstore-0.1.2.tar.gz

4.  Create a vmstore directory (needs to be done only once):
        vmkdir vos:<vospace>/vmstore

Create a permanent scratch space for the stored VM before being uploaded, and mount it at boot time

    sudo mkdir -p /vmstore
    echo "/dev/sdc    /vmstore    ext2    defaults    0 0" | sudo tee -a /etc/fstab

Safely update condor and install the new cloudscheduler init script. Make backups of important configuration information:

    sudo mv /etc/init.d/condor{,.bak}
    sudo mv /etc/condor/condor_config.local{,.bak}
    sudo yum update condor
    vcp vos:canfar/config/condor_config.local .
    sudo mv condor_config.local /etc/condor
    vcp vos:canfar/config/cloud_scheduler.init.d .
    sudo mv cloud_scheduler.init.d /etc/init.d/cloud_scheduler
    sudo chmod +x /etc/init.d/cloud_scheduler
    vcp vos:canfar/config/cloud_scheduler.sysconfig .
    sudo mv cloud_scheduler.sysconfig /etc/sysconfig/cloud_scheduler
    sudo /sbin/chkconfig --add cloud_scheduler

Make sure condor owns the scratch space because vmstore ignores the changes in /staging:

    echo "chown condor:condor /staging/condor" | sudo tee -a /etc/rc.local

Check the installation, the vmsave command should work:

    vmsave help

Set up the vmstore configuration:

    vmsave mc
    sudo vmsave mc

Edit \~/.vmstore/vmstore.conf and uncomment \#snapshot\_dir, replace the value of /vmstore with /staging Then copy: sudo cp \~/.vmstore/vmstore.conf /root/.vmstore/

Finally save it:

    sudo vmsave -t <vmtype> -v <vospace>

Ex: sudo vmsave -t myvm -v sfabbro

Boot your VM again. Edit \$HOME/.vmstore/vmstore.conf and comment out the value of snapshot\_dir again.

After this, use the [ instructions at the top of this page](#To_use_vmstore "wikilink"):


Keep informed about the vmstore commands
----------------------------------------

    vmsync help
    vmsave help
