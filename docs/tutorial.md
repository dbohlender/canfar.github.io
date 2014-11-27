---
layout: docs
title: Tutorial
permalink: /docs/tutorial/
---

## Introduction

CANFAR computing resources are currently provided by an [OpenStack](www.openstack.org) cloud called Nefos, which is managed by WestGrid on behalf of Compute Canada. See the [Nefos QuickStart Guide](https://www.westgrid.ca/support/quickstart/Nefos) for a brief introduction, noting that **CANFAR users already have accounts** and do not need to make separate access requests. If you do not have a CANFAR account [register for one here]({{site.basepath}}/docs/register).

This tutorial demonstrates how to:

* create, configure, and interact with Virtual Machines (VMs) using the graphical interface (Virtual Machine on Demand)

* launch batch processing jobs from the CANFAR login host, using VMs created in the previous step.


## Virtual Machine on Demand

VM on demand is provided by the OpenStack dashboard at Nefos. [Log into the dashboard](https://nefos.westgrid.ca). Provide your CANFAR username with a ```-canfar``` suffix, e.g, ```janesmith-canfar```, and your usual CANFAR password.

Each resource allocation corresponds to a **tenant**, and typically there will be one tenant per CANFAR project. A pull-down menu near the top-left allows you to select different tenants that you are a member of.

### Update security group to allow ssh access

Click on **Access & Security** (left column of page), and then the **Security Groups** tab. Click on the **Manage Rules** button next to the default group. Click on the **+ Add Rule** button near the top-right. Select **SSH** at the bottom of the **Rule** pull-down menu, and then click on **Add** at the bottom-right. **This operation is only required once for the initial setup of the tenant**.

### Import an ssh public key

Click on **Access & Security** and switch to the **Key Pairs** tab and click on the **Import Key Pair** button at the top-right. Choose a meaningful name for the key, and then copy and paste the contents of ```~/.ssh/id_rsa.pub``` from the machine you plan to ssh from into the **Public Key** window. If you have not yet created a key pair on your system, run ```ssh-keygen``` to generate one.

**SG suggests link to ssh key generation doc**

### Allocate public IP address to tenant

Click on the **Floating IPs** tab. If there are no IPs listed, click on the **Allocate IP to Project** button at the top-right. Each tenant will typically have one public IP. If you have already allocated all of your IPs, this button will read "Quota Exceeded".

### Launch a VM Instance

Switch to the **Instances** window (left-hand column), and then click on **+ Launch Instance**.

In the **Details** tab choose a meaningful **Instance Name**. **Flavor** is the hardware profile for the VM. ```m1.small``` provides the minimal requirements for most VMs. **Availability Zone** should be left empty, and **Instance Count** 1 for this tutorial. Under **Instance Boot Source** select ```Boot from image```; an **Image Name** pull-down menu will appear. Using it, select an image, e.g., ```CentOS 7```, or one of your old VM images if they have been migrated for you,

In the **Access & Security** tab ensure that your public key is selected, and the ```default``` security group (with ssh rule added) is selected.

Finally, click the **Launch** button.

### Interact with the VM

After launching the VM you are returned to the **Instances** window. You can check the VM status once booted by clicking on its name (the **Console** tab of this window provides a VNC console in which you can monitor the boot process).

Before being able to ssh to your instance, you will need to attach the public IP address to it. Return to the **Instances** window and select **Associate Floating IP** from the **More** pull-down menu. Select the address that was allocated and the new VM instance in the **Port to be associated** menu, and click on **Associate**.

Your ssh public key will have been injected into a **generic account** with a name like ```ec2-user```, ```cloud-user```, ```centos```, or ```ubuntu```, depending on the Linux distribution. To discover the name of this account, first attempt to connect as root:

{% highlight bash %}
$ ssh root@206.12.48.93
Please login as the user "cloud-user" rather than the user "root".

$ ssh cloud-user@206.12.48.93
[cloud-user@new-instance ~]$
{% endhighlight %}

If you require **root** access (e.g, to install software), prefix commands with ```sudo```.

### Booting a VM image migrated from the old system

As part of the migration to OpenStack from Nimbus, VM images were located in the personal VOSpaces of existing CANFAR users and then converted and copied into OpenStack tenants. Please note the following:

  * *VM images are stored in the tenant, not a personal VOSpace.* If several users are a member of the same tenant they need to keep track of the different VM images that they have created.

  * *The size of the root partition is not dynamic.* If your old VM (from ```vos:[yourname]/vmstore```) had a size of 10 G, you will need to select a flavor with a root partition of at least that size. However, if you select a flavor with a much larger size (e.g., 50 G), the instantiated VM will still only use 10 G.

  * *The ssh public key is injected into a new generic account.* For example, if you had a Scientific Linux 5 VM, you will have your old user account in ```/home/[yourname]```, but OpenStack will have created a new account called ```ec2-user``` when the VM was instantiated, and copied the ssh public key into that account instead. Note that your old account is unchanged and may still be used. You can update the public keys for that old user using the one(s) injected into the generic account using **sudo**:

  {% highlight bash %}
  [cloud-user@new-instance ~]$ cat .ssh/authorized_keys >> /home/[yourname]/.ssh/authorized_keys
  {% endhighlight %}

  You may then log out, and re-connect to your original account using the new ssh keypair.

  * *The /staging partition is only properly mounted for batch processing.* You may see ```/staging``` on a migrated VM, but it will not have any additional space beyond what is in the root partition.

### Snapshot (save) a VM Instance

Save the state of your VM by navigating to the **Instances** window, and clicking on the **Create Snapshot** button to the right of your VM instance's name. After selecting a name for the snapshot (can be identical to previous image names, as images also have unique UIDs associated with them), click the **Create Snapshot** button. It will eventually be saved and listed in the **Images** window, and will be available next time you launch an instance.

### Shut down a VM Instance

In the **Instances** window, select ```Terminate Instance``` in the **More** pull-down menu, and confirm.

### Additional secionts?

* volumes
* scratch space
* create specific user counts for batch


## Batch processing

**The following is old text and will slowly be re-worked into the new tutorial**

### Create a Virtual Machine

Let's create a VM called *vmdemo*. From the [CANFAR Processing Page](http://www.canfar.phys.uvic.ca/processing), login with your CADC credentials, and create a VM using the web interface:

- Choose a **VM Name** - enter *vmdemo*
- Choose a **Template VM** - the first one on the list works fine
- Leave **Processing Cores**, **Memory** and **Staging Disk Space** to their default values
- Copy the ssh key from the canfar login host you created above
  `$HOME/.ssh/id_rsa.pub` to the **Public SSH Key** entry box
- Click **Create**
	
Wait a few minutes for an email that will tell you your VM is ready and will give you a private IP address for the VM that you can access only from the CANFAR login host. Then click on **Running VMs**, or simply refresh the page if you were already on it: you should see your VM and the private IP.

{% include backToTop.html %}

### Install software

You can use the ssh wrapper script to connect to the just created VM from the CANFAR login host:

{% highlight bash %}
vmssh vmdemo
{% endhighlight %}

or follow this [guide]({{site.basepath}}/docs/vmacess/) for other ways access the VM such as VNC.

The VM operating system has only a set of minimal packages. For this tutorial, we need the [SExtractor](http://www.astromatic.net/software/sextractor) package to create catalogues of stars and galaxies. We will install it from source for illustration purpose:

{% highlight bash %}
wget http://www.astromatic.net/download/sextractor/sextractor-2.19.5.tar.gz
tar xf sextractor-2.19.5.tar.gz
cd sextractor-2.19.5
./configure
{% endhighlight %}

As you can see, it fails on missing dependencies: the `fftw` libraries as reported by the configure command. If you only install the `fftw` libraries and run `./configure` again, you will see the `atlas` libraries are missing too. Fortunately they have already been packaged for RedHat based systems, which is what Scientific Linux is based on. So we can install them with the`yum` package manager:

{% highlight bash %}
sudo yum install fftw3-devel.x86_64 atlas-devel.x86_64
{% endhighlight %}

Now we can finish up our SExtractor installation

{% highlight bash %}
./configure
make
sudo make install
{% endhighlight %}

Most FITS images from CADC come Rice-compressed with a `fz` extension. SExtractor reads uncompressed images only, so we also need the [funpack](http://heasarc.nasa.gov/fitsio/fpack/) utility to uncompress data from CADC. Download and install it on your VM with the following commands:

{% highlight bash %}
wget http://heasarc.gsfc.nasa.gov/fitsio/fpack/bin/pc_linux_64bit/funpack
sudo mv funpack /usr/local/bin
sudo chmod a+x /usr/local/bin/funpack
{% endhighlight %}

{% include backToTop.html %}

### Test

We are now ready to do a simple test. Let's download a FITS image on scratch space (called *staging*), uncompress it and run SExtractor on it:

{% highlight bash %}
cd ${TMPDIR}
cp -r ${HOME}/sextractor-2.8.6/config/default* .
wget -O 1056213p.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&amp;asf=true&amp;file_id=1056213p'
funpack 1056213p.fits.fz
sex 1056213p.fits -CATALOG_NAME 1056213p.cat 
{% endhighlight %}

The image `1056213p.fits.fz` is a Multi-Extension FITS file with 36 extensions, each containing data from one CCD from the CFHT Megacam camera.

{% include backToTop.html %}

### Store the results

We want to store the output catalogue `1056213p.cat` on a persistent storage because the scratch space where it resides now will be wiped out when the VM shuts down. So we will use VOSpace to store the result. To access VOSpace, we need a proxy authorization of your behalf to store files. If you ran `canfarsetup` and answered yes to create a `.netrc` file, you can copy it from the CANFAR login host to your VM to automate CADC and canfar credentials calls:

{% highlight bash %}
scp canfar.dao.nrc.ca:.netrc ~/
{% endhighlight %}

On the VM, download a proxy certificate for 10 days with the following command:

{% highlight bash %}
getCert
{% endhighlight %}

Let's check that the VOSpace client works by copying the results to your VOSpace:

{% highlight bash %}
vcp 1056213p.cat vos:USER
{% endhighlight %}

Verify that the file is properly uploaded by pointing your browser to the [VOSpace browser interface](http://www.canfar.phys.uvic.ca/vosui/%20VOSpace%20web%20interface). 

{% include backToTop.html %}

### Batch processing

Now we want to automate the whole procedure above in a single script. Paste all the commands above into one BASH script:

{% highlight bash %}
#!/bin/bash
cd ${TMPDIR}
wget -O $1.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&amp;asf=true&amp;file_id='$1
funpack  $1.fits.fz
cp ~/sextractor-2.19.5/config/default.* .
sex $1.fits -CATALOG_NAME $1.cat 
vcp $1.cat vos:USER;/
{% endhighlight %}

Remember to substitute USER with your CADC user account.
	
This script runs all the commands, one after the other, and takes only one parameter represented by by the shell variable '$1', the file ID on the CADC CFHT archive. Save your script which we will name "mydemo.bash" and set it as executable: 

{% highlight bash %}
chmod +x mydemo.bash
{% endhighlight %}

Now let's test the newly created script with a different file ID. If the script is on your home directory type: 

{% highlight bash %}
~/mydemo.bash 1056214p
{% endhighlight %}

Just as during the manual testing, verify the output, and the check with the VOSpace web interface on that the catalogue has been uploaded.

{% include backToTop.html %}

### Save the Virtual Machine

To launch batch jobs to various clusters, you will need to store your software stack installed on your Virtual Machine. To do this, you simply save the full Virtual Machine into one file, then upload it to your VOSpace.
	
Your VOSpace directory needs to be public. Go to [your VOSpace](http://www.canfar.phys.uvic.ca/vosui) then one directory up, and change the permissions by clicking on the folder icon next to your VOSpace name.

Before the first VM to save, you need to create the vmstore directory on you VOSpace where you will keep your VMs: 

{% highlight bash %}
vmkdir vos:USER/vmstore
{% endhighlight %}

Then save your VM with the following command:

{% highlight bash %}
sudo vmsave -t vmdemo -v USER
{% endhighlight %}

You will wait 4min until your brand new VM has been saved. You can then check the VM on [your VOSpace](http://www.canfar.phys.uvic.ca/vosui/), and go to the `vmstore` directory.

{% include backToTop.html %}

### Configure your processing

Now we are ready to launch a bunch of batch processing jobs creating catalogues of various CFHT Megacam images and uploading the catalogues to the VOSpace. On the CANFAR login host, copy over your `mydemo.bash` script. Get the VM IP address: 

{% highlight bash %}
vmlist
{% endhighlight %}

Copy the returned IP and remote-copy your script:

{% highlight bash %}
scp VM_IP:mydemo.bash .
{% endhighlight %}

You are done for the configuration part. If you don't need to run batch jobs, you can stop now. If you need to run batch jobs, you need to get used to the [HT condor](http://www.htcondor.org) scheduler. Let's make a condor submission script that will run the `mydemo.bash` script for each given CADC CFHT file id. We will do it for 3 CFHT images with the file ids 1056215p, 1056216p and 1056217p. For this tutorial you will modify the configuration file listed below. Fire up your favorite editor to paste the following condor submission file:

{% highlight text %}
Universe   = vanilla
Executable = mydemo.bash
should_transfer_files = YES
when_to_transfer_output = ON_EXIT
RunAsOwner = True
getenv = True
transfer_output_files = /dev/null
Requirements = VMType =?= "vmdemo" && \
               Arch == "x86_64" && \
               Memory >= 1024 && \
               Cpus >=  1
+VMLoc="http://www.canfar.phys.uvic.ca/data/pub/vospace/USER/vmstore/vmdemo.img.gz"
+VMMem="1024"
+VMCPUCores="1"
+VMStorage="10"

Arguments = 1056215p
Log = 1056215p.log
Output = 1056215p.out
Error = 1056215p.err
Queue

Arguments = 1056216p
Log = 1056216p.log
Output = 1056216p.out
Error = 1056216p.err
Queue

Arguments = 1056217p
Log = 1056217p.log
Output = 1056217p.out
Error = 1056217p.err
Queue
{% endhighlight %}

Again, make sure in the script above to substitute USER by your CADC username.

{% include backToTop.html %}

### Execute it

Save the submission file as `mydemo.sub` and  submit your jobs to the condor job pool:

{% highlight bash %}
condor_submit mydemo.sub
{% endhighlight %}

Count the dots, there should be 3. Wait a couple minutes. Find where your jobs stand on the queue: 

{% highlight bash %}
condor_q
{% endhighlight %}

Check the status of your jobs:

{% highlight bash %}
condor_status USER
{% endhighlight %}

If your job  is running (job status is R), you can connect to your running job:

{% highlight bash %}
condor_ssh_to_job JOB_ID
{% endhighlight %}

and you'll end up in the `$TMPDIR`  directory. The interesting files are:

- `_condor_stderr` on the VM will become `mydemo.err` on the login host
- `_condor_stdout` on the VM will become `mydemo.out` on the login host
- `condor_exec.exe` was your script `mydemo.bash`

Once you have no more jobs on the queue, check the logs and output files `mydemo.*` on the login host, and check on your VOSpace browser all the 3 generated catalogues have been uploaded. 
	
You are done!


{% include backToTop.html %}
