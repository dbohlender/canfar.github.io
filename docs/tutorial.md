---
layout: docs
title: Tutorial
permalink: /docs/tutorial/
---

The goal of this tutorial is to show you how to:
- create a Virtual Machine on CANFAR
- make with a very simple script which will download public astronomical image and detect sources
- store the detected sources into your VOSpace storage
- launch batch jobs doing executing the same script with other astronomical images

## Setup
We assume here you have the following accounts activated:
- a [CADC Account](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/auth/request.html%20CADC%20account)
- a [CANFAR account](register.html) with access for both storage and
  processing on CANFAR.
  
They are both with the same username which we will refer to the CADC username.
Replace USER with your CADC username. Then connect to to the canfar
host with your CADC username and password:

	ssh USER@canfar.dao.nrc.ca

If this is the first time you login to this machine, run the following
script to make your life easier using VOSpace and certificates.
	
	canfarsetup

It generates a proxy X.509 certificate ($HOME/.ssl/cadcproxy.pem)
to access your VOSpace, a file ($HOME/.netrc) to automatically
connect to CANFAR web services, and an ssh key pair
($HOME/.ssh/id_rsa.*) to access your Virtual Machines (VMs).
The canfar login host is a bastion host or jump host. You need to
connect to it to access your VMs, the VMs are not accessible from
outside the CADC internal network.

## Create a Virtual Machine

Let's create a VM called *vmdemo*. From the
[CANFAR Processing Page](http://www.canfar.phys.uvic.ca/processing),
login with your CADC credentials, and create a VM using the web
interface:

- Choose a **VM Name** - enter *vmdemo*
- Choose a **Template VM** - the first one on the list (Scientific Linux 5) works fine
- Leave **Processing Cores**, **Memory** and **Staging Disk Space** to their default values
- Copy the ssh key from the canfar login host you created above
($HOME/.ssh/id_rsa.pub) to the "Public SSH Key" entry box
- Click **Create**
	
Wait a few minutes for an email that will tell you the VM is ready and
will give you a private IP address for the VM that you can access only
from the CANFAR login host. Then click on "Running VMs", or simply
refresh the page if you were already on it: you should see your VM and
the private IP.
	
## Install software on the Virtual Machine

You can use the ssh wrapper script to connect to the just created VM
from the CANFAR login host:

	vmssh vmdemo

or follow this [guide](vmacess) for a more graphical way to
access the VM through the browser.

The VM operating system has only a set of minimal packages. For this
tutorial, we need the [SExtractor](http://www.astromatic.net/software/sextractor)
package to create catalogues of stars and galaxies. We will install it
from source for illustration purpose:
	
    wget http://www.astromatic.net/download/sextractor/sextractor-2.19.5.tar.gz
    tar xf sextractor-2.19.5.tar.gz
    cd sextractor-2.19.5
    ./configure

As you can see, it fails on missing dependencies: the `fftw` libraries
as reported by the configure command. If you only install the `fftw`
libraries and run `./configure` again, you will see the `atlas`
libraries are missing too. Fortunately they have already been packaged
for RedHat based systems, which is what Scientific Linux is based
on. So we can install them with the`yum` package manager:
	
	sudo yum install fftw3-devel.x86_64 atlas-devel.x86_64
	
Now we can finish up our SExtractor installation
	
	./configure
	make
	sudo make install

Most FITS images from CADC come compressed in the fz
format. SExtractor reads uncompressed images only, so we also need the
`funpack` executable from CFITSIO to uncompress data from
CADC. Download and install it on your VM with the following commands:
	
    wget http://heasarc.gsfc.nasa.gov/fitsio/fpack/bin/pc_linux_64bit/funpack
    sudo mv funpack /usr/local/bin
    sudo chmod a+x /usr/local/bin/funpack
	
## Test the pipeline

We are now ready to do a simple test. Let's download a FITS image on
scratch space (called *staging*), uncompress it and run SExtractor on it:
	
	cd ${TMPDIR}
	cp -r ${HOME}/sextractor-2.8.6/config/default* .
	wget -O 1056213p.fits.fz 'http://www.cadc.hia.nrc.gc.ca/getData?archive=CFHT&amp;asf=true&amp;file_id=1056213p'
	funpack 1056213p.fits.fz
	sex 1056213p.fits -CATALOG_NAME 1056213p.cat 
	
The image "1056213p.fits.fz" is a Multi-Extension FITS file with 36
extensions, each containing data from one CCD from the CFHT Megacam
camera. 
	
## Store the results

We want to store the output catalogue 1056213p.cat on a persistent
storage because the scratch space where it resides now will be wiped
out when the VM shuts down. So we will use VOSpace to store the
result. To access VOSpace, we need a proxy authorization of your
behalf to store files. If you ran `canfarsetup` and answered yes to
create a `.netrc` file, you can copy it from the CANFAR login host to
your VM to automate CADC and canfar credentials calls: 
	
	scp canfar.dao.nrc.ca:.netrc ${HOME}/

On the VM, download a proxy
[X.509 certificate](http://en.wikipedia.org/wiki/X.509) for 7 days
with the following command:

	getCert
	
Let's check that the VOSpace client works by copying the results to your VOSpace:

	vcp 1056213p.cat vos:USER
	
Verify that the file is properly uploaded by pointing your browser to
the [VOSpace browser interface](http://www.canfar.phys.uvic.ca/vosui/%20VOSpace%20web%20interface). 

## Create a script for batch

Now we want to automate the whole procedure above in a single
script. Paste all the commands above into one BASH script: 

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
	
This script runs all the commands, one after the other, and takes only
one parameter represented by by the shell variable '$1', the file ID
on the CADC CFHT archive. Save your script which we will name
"mydemo.bash" and set it as executable: 

	chmod +x mydemo.bash
	
Now let's test the newly created script with a different file ID. If
the script is on your home directory type: 
	
	${HOME}/mydemo.bash 1056214p

Just as during the manual testing, verify the output, and the check
with the VOSpace web interface on that the catalogue has been
uploaded. 
	
## Save the Virtual Machine

To launch batch jobs to various clusters, you will need to store your
software stack installed on your Virtual Machine. To do this, you
simply save the full Virtual Machine into one file, then upload it to
your VOSpace.
	
Your VOSpace directory needs to be public. Go
[your VOSpace](http://www.canfar.phys.uvic.ca/vosui) then one
directory up, and change the permissions by clicking on the folder
icon next to your VOSpace name. 
	
Before the first VM to save, you need to create the vmstore directory
on you VOSpace where you will keep your VMs: 
	
	vmkdir vos:USER/vmstore
	
Then save your VM with the following command:
	
	sudo vmsave -t vmdemo -v USER
	
You will wait 4mn until your brand new VM has been saved. You can then
check the VM on your VOSpace by again pointing to
[your VOSpace](http://www.canfar.phys.uvic.ca/vosui/), and go to the
vmstore directory.

## Configure a submission file

Now we are ready to launch a bunch of batch processing jobs creating
catalogues of various CFHT Megacam images and uploading the catalogues
to the VOSpace. On the CANFAR login host, copy over your `mydemo.bash`
script. Get the VM IP address: 
	
	vmlist

Copy the returned IP and remote-copy your script:
	
	scp VM_IP:mydemo.bash .

You are done for the configuration part. If you don't need to run batch jobs, you can stop now.
If you need to run batch jobs, you need to get used to the
[HT condor](http://www.htcondor.org) scheduler. Let's make a condor
submission script that will run the `mydemo.bash` script for each
given CADC CFHT file id. We will do it for 3 CFHT images with the file
ids 1056215p, 1056216p and 1056217p. For this tutorial you will modify
the configuration file listed below. Fire up your favorite editor to
paste the following condor submission file:

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

Again, make sure in the script above to substitute USER by your CADC username.

## Submitting a processing job

Save the script as "mydemo.sub" and  submit your script to the condor
job pool:
	
	condor_submit mydemo.sub

Count the dots, there should be 3. Wait a couple minutes. Find where
your jobs stand on the queue: 

	condor_q

Check the status of your jobs:

	condor_status USER

If your job  is running (job status is R), you can connect to your running job:

	condor_ssh_to_job JOB_ID

and you'll end up in the `$TMPDIR`  directory. The interesting files are:

- `_condor_stderr` on the VM will become `mydemo.err` on the login host
- `_condor_stdout` on the VM will become `mydemo.out` on the login host
- `condor_exec.exe` was your script `mydemo.bash`

Once you have no more jobs on the queue, check the logs and output
files `mydemo.*` on the login host, and check on your VOSpace browser
all the 3 generated catalogues have been uploaded. 
	
You are done!