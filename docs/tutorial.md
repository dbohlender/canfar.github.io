---
layout: docs
title: Tutorial
permalink: /docs/tutorial/
---

<div class="span-4 module-table-contents">
	<h2>Table of contents</h2>
  <ul class="column-2">
    <li><a href="#setup">Setup</a></li>
    <li><a href="#create-a-virtual-machine">Create the Virtual Machine</a></li>
    <li><a href="#install-software">Install software</a></li>
    <li><a href="#test">Test</a></li>
    <li><a href="#store-the-results">Store the results</a></li>
    <li><a href="#batch-processing">Batch processing</a></li>
    <li><a href="#save-the-virtual-machine">Save the Virtual Machine</a></li>
    <li><a href="#configure-your-processing">Configure your processing</a></li>
    <li><a href="#execute-it">Execute it</a></li>
  </ul>
</div>
<div class="clear"></div>

## Setup

If you have not already [registered]({{site.basepath}}/docs/register), please do so.  Then connect to to the canfar login host with the CADC `USERNAME` and password:

{% highlight bash %}
ssh USERNAME@canfar.dao.nrc.ca
{% endhighlight %}

If this is your first time logging in to this machine, run the following script to make your life easier using VOSpace and certificates:

{% highlight bash %}
canfarsetup
{% endhighlight %}

It will generate a proxy for your [X.509 certificate](http://en.wikipedia.org/wiki/X.509) in `$HOME/.ssl/cadcproxy.pem` to access your VOSpace, a `$HOME/.netrc` file to automatically connect to CANFAR web services, and an ssh key pair `$HOME/.ssh/id_rsa.*` to access your Virtual Machines (VMs).
The canfar login host is a bastion host or jump host. You need to connect to it to access your VMs, the VMs are not accessible from outside the CADC internal network.

{% include backToTop.html %}

## Create a Virtual Machine

Let's create a VM called *vmdemo*. From the [CANFAR Processing Page](http://www.canfar.phys.uvic.ca/processing), login with your CADC credentials, and create a VM using the web interface:

- Choose a **VM Name** - enter *vmdemo*
- Choose a **Template VM** - the first one on the list works fine
- Leave **Processing Cores**, **Memory** and **Staging Disk Space** to their default values
- Copy the ssh key from the canfar login host you created above
  `$HOME/.ssh/id_rsa.pub` to the **Public SSH Key** entry box
- Click **Create**
	
Wait a few minutes for an email that will tell you your VM is ready and will give you a private IP address for the VM that you can access only from the CANFAR login host. Then click on **Running VMs**, or simply refresh the page if you were already on it: you should see your VM and the private IP.

{% include backToTop.html %}

## Install software

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

## Test

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

## Store the results

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

## Batch processing

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

## Save the Virtual Machine

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

## Configure your processing

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

## Execute it

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
