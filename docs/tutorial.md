---
layout: docs
title: Tutorial
permalink: /docs/tutorial/
---

## Introduction

CANFAR computing resources are currently provided by an [OpenStack cloud](http://www.openstack.org) which is managed by WestGrid on behalf of Compute Canada. See the [QuickStart Guide](https://www.westgrid.ca/support/quickstart/Nefos) for a brief introduction, noting that **CANFAR users already have accounts** and do not need to make separate access requests. If you do not have a CANFAR account [register for one here]({{site.basepath}}/docs/register).

This tutorial demonstrates how to:

* create, configure, and interact with Virtual Machines (VMs) using the graphical interface (Virtual Machine on Demand)

* launch batch processing jobs from the CANFAR login host, using VMs created in the previous step.

## Virtual Machine on Demand

VM on demand is provided by the OpenStack dashboard at WestGrid. [Log into the dashboard](https://west.cloud.computecanada.ca). Provide your CANFAR username with a ```-canfar``` suffix, e.g, ```janesmith-canfar```, and your usual CANFAR password.

Each resource allocation corresponds to a **tenant**, and typically there will be one tenant per CANFAR project. A user may be a member of multiple tenants, and a tenant may have multiple users. A pull-down menu near the top-left allows you to select between the different tenants that you are a member of.

### Update security group to allow ssh access

Click on **Access & Security** (left column of page), and then the **Security Groups** tab. Click on the **Manage Rules** button next to the default group. Click on the **+ Add Rule** button near the top-right. Select **SSH** at the bottom of the **Rule** pull-down menu, and then click on **Add** at the bottom-right. **This operation is only required once for the initial setup of the tenant**.

### Import an ssh public key

Access to VMs is facilitated by SSH key pairs rather than less secure user name / password. A private key resides on your own computer, and the public key is copied to all machines that you wish to connect to. Click on **Access & Security**, switch to the **Key Pairs** tab and click on the **Import Key Pair** button at the top-right. Choose a meaningful name for the key, and then copy and paste the contents of ```~/.ssh/id_rsa.pub``` from the machine you plan to ssh from into the **Public Key** window. If you have not yet created a key pair on your system, run **ssh-keygen** to generate one.

**SG suggests link to ssh key generation doc**

### Allocate public IP address to tenant

Click on the **Floating IPs** tab. If there are no IPs listed, click on the **Allocate IP to Project** button at the top-right. Each tenant will typically have one public IP. If you have already allocated all of your IPs, this button will read "Quota Exceeded".

### Launch a VM Instance

Switch to the **Instances** window (left-hand column), and then click on **+ Launch Instance**.

In the **Details** tab choose a meaningful **Instance Name**. **Flavor** is the hardware profile for the VM. ```c2.low``` provides the minimal requirements for most VMs. Note that it provides an 80 GB *ephemeral partition* that will be used as scratch space for batch processing. **Availability Zone** should be left empty, and **Instance Count** 1 for this tutorial. Under **Instance Boot Source** select ```Boot from image```; an **Image Name** pull-down menu will appear. Using it, select an image. For this tutorial, select ```CentOS```.

In the **Access & Security** tab ensure that your public key is selected, and the ```default``` security group (with ssh rule added) is selected.

In the **Post-Creation** tab you can specify [scripts](http://cloudinit.readthedocs.org/en/latest/topics/format.html) to perform additional configuration on the VM after it boots. In order to prepare a VM for batch processing, paste the following lines in the **Customization Script** window (note that it is also possible to perform this configuration at a later point by executing a script from within the running VM):
{% highlight bash %}
#include
https://raw.githubusercontent.com/canfar/openstack-sandbox/master/vm_config/cloud_config.yml
{% endhighlight %}

Finally, click the **Launch** button.

### Connect to the VM and create CANFAR user

After launching the VM you are returned to the **Instances** window. You can check the VM status once booted by clicking on its name (the **Console** tab of this window provides a VNC console in which you can monitor the boot process).

Before being able to ssh to your instance, you will need to attach the public IP address to it. Return to the **Instances** window and select **Associate Floating IP** from the **More** pull-down menu. Select the address that was allocated and the new VM instance in the **Port to be associated** menu, and click on **Associate**.

Your ssh public key will have been injected into a **generic account** with a name like ```ec2-user```, ```cloud-user```, ```centos```, or ```ubuntu```, depending on the Linux distribution. To discover the name of this account, first attempt to connect as root:

{% highlight bash %}
ssh root@206.12.48.93
Please login as the user "centos" rather than the user "root".

ssh centos@206.12.48.93
{% endhighlight %}

For batch processing to work, it is presently necessary for you to create an account on the VM with your CANFAR user name (with a copy of the ssh public key so that you may connect):

{% highlight bash %}
sudo adduser [yourname] -G wheel
sudo mkdir /home/[yourname]/.ssh
sudo cp .ssh/authorized_keys /home/[yourname]/.ssh/
sudo chown [yourname]:[yourname] /home/[yourname]/.ssh/authorized_keys
sudo sh -c "echo \"[yourname] ALL=(ALL) NOPASSWD:ALL\" >> /etc/sudoers"
{% endhighlight %}

Exit and re-connect as your new user:

{% highlight bash %}
exit
logout
Connection to 206.12.48.93 closed.
ssh [yourname]@206.12.48.93
{% endhighlight %}

### Install software

The VM operating system has only a set of minimal packages. For this tutorial, we need the [SExtractor](http://www.astromatic.net/software/sextractor) package to create catalogues of stars and galaxies.

{% highlight bash %}
sudo yum install wget
wget http://www.astromatic.net/download/sextractor/sextractor-2.19.5-1.x86_64.rpm
sudo rpm -i sextractor-2.19.5-1.x86_64.rpm
{% endhighlight %}

Most FITS images from CADC come Rice-compressed with a `fz` extension. SExtractor reads uncompressed images only, so we also need the funpack utility to uncompress data from CADC. Install it on your VM with the following commands:

{% highlight bash %}
sudo yum install epel-release
sudo yum install fpack
{% endhighlight %}

{% include backToTop.html %}

### Test

We are now ready to do a simple test. Let's download a FITS image to our scratch space. When we instantiated the VM we chose a flavor with an *ephemeral partition*, and the customization script we specified mounted it at ```/ephemeral```. This partition is where batch processing will take place. For this interactive session, create a directory owned by your user, copy an image file there, uncompress it, and run SExtractor on it:

{% highlight bash %}
cd /ephemeral
sudo mkdir work
sudo chown [yourname]:[yourname] work
cd work
cp /usr/share/sextractor/default* .
rm default.param
echo 'NUMBER
MAG_AUTO
X_IMAGE
Y_IMAGE' > default.param
wget -O 1056213p.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData/?archive=CFHT&asf=true&file_id=1056213p'
funpack 1056213p.fits.fz
sex 1056213p.fits -CATALOG_NAME 1056213p.cat
{% endhighlight %}

The image `1056213p.fits.fz` is a Multi-Extension FITS file with 36 extensions, each containing data from one CCD from the CFHT Megacam camera.

{% include backToTop.html %}

### Store the results

We want to store the output catalogue `1056213p.cat` on a persistent storage medium because the ephemeral partition where it resides now will be wiped out when the VM shuts down. So we will use VOSpace to store the result. To access VOSpace, we need proxy authorization of your behalf to store files. This is accomplished using a `.netrc` file that contains your CANFAR user name and password, and then **getCert** can obtain an *X509 Proxy Certificate* using that name/password combination without any further user interaction.

{% highlight bash %}
echo "machine www.canfar.phys.uvic.ca login [yourname] password [yourpassword]" > ~/.netrc
chmod 600 ~/.netrc
sudo yum install python-pip
sudo pip install -U vos
getCert
{% endhighlight %}

Let's check that the VOSpace client works by copying the results to your VOSpace:

{% highlight bash %}
vcp 1056213p.cat vos:[yourname]
{% endhighlight %}

Verify that the file is properly uploaded by pointing your browser to the [VOSpace browser interface](http://www.canfar.phys.uvic.ca/vosui).

### Write an automated processing script

Now we want to automate the whole procedure above in a single script, in preparation for batch processing. Paste the following commands into one BASH script in your home directory:

{% highlight bash %}
#!/bin/bash
cd ${TMPDIR}
wget -O $1.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&asf=true&file_id='$1
funpack  $1.fits.fz
cp /usr/share/sextractor/default* .
echo 'NUMBER
MAG_AUTO
X_IMAGE
Y_IMAGE' > default.param
sex $1.fits -CATALOG_NAME $1.cat
fi
getCert
vcp $1.cat vos:[yourname]
{% endhighlight %}

Remember to substitute [yourname] with your CANFAR user account.

This script runs all the commands, one after the other, and takes only one parameter represented by by the shell variable '$1', the file ID on the CADC CFHT archive. Save your script which we will name "mydemo.bash" and set it as executable:

{% highlight bash %}
export TMPDIR=/ephemeral/work
chmod +x mydemo.bash
{% endhighlight %}

Now let's test the newly created script with a different file ID. If the script is on your home directory type:

{% highlight bash %}
~/mydemo.bash 1056214p
{% endhighlight %}

Just as during the manual testing, verify the output, and the check with the VOSpace web interface on that the catalogue has been uploaded.

{% include backToTop.html %}

### Snapshot (save) the VM Instance

Save the state of your VM by navigating to the **Instances** window, and clicking on the **Create Snapshot** button to the right of your VM instance's name. After selecting a name for the snapshot, e.g., ```tutorial``` (note: in general pick a unique name to avoid conflicts with other users!), click the **Create Snapshot** button. It will eventually be saved and listed in the **Images** window, and will be available next time you launch an instance.

### Shut down the VM Instance

In the **Instances** window, select ```Terminate Instance``` in the **More** pull-down menu, and confirm.

### Additional sections?

* volumes
* scratch space

## Batch processing

Now we are ready to launch a bunch of batch processing jobs creating catalogues of various CFHT Megacam images and uploading the catalogues to VOSpace.

### Configure your batch processing job

Assuming you have the `mydemo.bash` script on your local machine, copy it to the CANFAR batch host, and then log in:

{% highlight bash %}
scp mydemo.bash batch.canfar.net:
ssh bash.canfar.net
{% endhighlight %}

Batch jobs are scheduled using a system called [HT Condor](http://www.htcondor.org). Let's make a condor submission script that will run the `mydemo.bash` script for each given CADC CFHT file id. We will do it for 3 CFHT images with the file ids 1056215p, 1056216p and 1056217p. For this tutorial you will modify the configuration file listed below. Fire up your favorite editor to paste the following condor submission file:

{% highlight text %}
Universe   = vanilla
Executable = mydemo.bash
should_transfer_files = YES
when_to_transfer_output = ON_EXIT_OR_EVICT
RunAsOwner = True
transfer_output_files = /dev/null
Requirements = VMType =?= "tutorial" && \
               Arch == "x86_64"

+VMAMI          = "canfar:tutorial"
+VMInstanceType = "canfar:c2.low"

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

Again, make sure in the script above to substitute USER by your CANFAR username.

{% include backToTop.html %}

### Execute it

Save the submission file as `mydemo.sub`.

Source the OpenStack RC file, and enter your CANFAR password. This sets environment variables used by OpenStack:
{% highlight bash %}
. canfar-cadc-openrc.sh
Please enter your OpenStack Password:
{% endhighlight %}

You can then submit your jobs to the condor job pool:
{% highlight bash %}
condor_submit mydemo.sub
{% endhighlight %}

Count the dots, there should be 3. Wait a couple minutes. Find where your jobs stand on the queue: 

{% highlight bash %}
condor_q
{% endhighlight %}

Check the status of your jobs:

{% highlight bash %}
condor_status [yourname]
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

## Notes

### Using a VM image migrated from the old system

Rather than configuring a new VM, users of the old system may use their old VMs. As part of the migration to OpenStack from Nimbus, VM images were located in the  personal VOSpaces of existing CANFAR users and then converted and copied into OpenStack tenants. Please note the following:

  * *VM images are stored in the tenant, not a personal VOSpace.* If several users are a member of the same tenant they need to keep track of the different VM images that they have created.

  * *The size of the root partition is not dynamic.* If your old VM (from ```vos:[yourname]/vmstore```) had a size of 10 G, you will need to select a flavor with a root partition of at least that size. However, if you select a flavor with a much larger size (e.g., 50 G), the instantiated VM will still only use 10 G.

  * *The ssh public key is injected into a new generic account.* For example, if you had a Scientific Linux 5 VM, you will have your old user account in ```/home/[yourname]```, but OpenStack will have created a new account called ```ec2-user``` when the VM was instantiated, and copied the ssh public key into that account instead. Note that your old account is unchanged and may still be used. You can update the public keys for that old user using the one(s) injected into the generic account using **sudo**:

  {% highlight bash %}
  cat .ssh/authorized_keys >> /home/[yourname]/.ssh/authorized_keys
  {% endhighlight %}

  You may then log out, and re-connect to your original account using the new ssh keypair.

  * *The /staging partition is only properly mounted for batch processing.* You may see ```/staging``` on a migrated VM, but it will not have any additional space beyond what is in the root partition.

