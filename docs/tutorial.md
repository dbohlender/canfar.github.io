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

VM on demand is provided by the OpenStack dashboard at nefos. [Log into the dashboard](https://nefos.westgrid.ca). Provide your CANFAR username with a ```-canfar``` suffix, e.g, ```janesmith-canfar```, and your usual CANFAR password.

Each resource allocation corresponds to a **tenant**, and typically there will be one tenant per CANFAR project. A pull-down menu near the top-left allows you to select different tenants that you are a member of.

* **Update security group to allow ssh access** Switch to the **Access & Security** window (left column of page), and then the **Security Groups** tab. Click on the **Manage Rules** button next to the default group. Click on the **+ Add Rule** button near the top-right. Select **SSH** at the bottom of the **Rule** pull-down menu, and then click on **Add** at the bottom-right.

* **Import an ssh public key** Switch to the **Key Pairs** tab and click on the **Import Key Pair** button at the top-right. Choose a meaningful name for the key, and then copy and paste the contents of ```~/.ssh/id_rsa.pub``` from the machine you plan to ssh from into the **Public Key** window. If you have not yet created a key pair on your system, run ```ssh-keygen``` to generate one.

* **Allocate public IP address to tenant** Click on the **Floating IPs** tab. If there are no IPs listed, click on the **Allocate IP to Project** button at the top-right. Each tenant will typically have one public IP.

* **Launch a VM Instance** Switch to the **Instances** window (left-hand column), and then click on **+ Launch Instance**.
  * **Details** tab: choose any ```Instance Name```. ```Flavor``` is the hardware profile for the VM. ```m1.small``` provides the minimal requirements for most VMs. Under ```Instance Boot Source``` select ```Boot from image``` and then an image, e.g., ```CentOS 7```, or one of your old VM images if they have been migrated for you,
  * **Access & Security** tab: Make sure that your public key is selected, and the ```default``` security group (with ssh rule added) is ticked.
  * Click the **Launch** button.

* **Interact with the VM**
  * After launching the VM you are returned to the **Instances** window. You can check the VM status once booted by clicking on its name (one tab provides a VNC console).
  * Before being able to ssh to your instance, you will need to attach the public IP address to it. Return to the **Instances** window and select ```Associate Floating IP``` from the **More** pull-down menu. Select the address that was allocated and the new VM instance in the **Port to be associated** menu, and click on **Associate**.
  * Your ssh public key will have been injected into a **generic account** with a name like ```cloud-user``` or ```centos```, depending on the Linux distribution. To discover the name of this account, first attempt to connect as root:
  {% highlight bash %}
  $ ssh root@206.12.48.93
  Please login as the user "cloud-user" rather than the user "root".

  $ ssh cloud-user@206.12.48.93
  [cloud-user@new-instance ~]$
  {% endhighlight %}
  * If you require **root** access (e.g, to install software), prefix commands with ```sudo```.
  * **If you are booting a VM image migrated from the old system**
    * *VM images are stored in the tenant, not a personal VOSpace.* As part of the migration to OpenStack from Nimbus, VM images were located in the personal VOSpaces of existing CANFAR users and then converted and copied into OpenStack tenants. If several users are a member of the same tenant they need to keep track of the differen VM images that they have created.
    * *The size of the root partition is not dynamic.* If your old VM (from ```vos:[yourname]/vmstore```) had a size of 10 G, you will need to select a flavor with a root partition of at least that size. However, if you select a flavor with a much larger size (e.g., 50 G), the instamtiated VM will still only use 10 G.
    * *The ssh public key is injected into a new generic account,* For example, if you had a Scientific Linux 5 account, you will have your old user account in ```/home/[yourname]```, but OpenStack will have created a new account called ```ec2-user``` when the VM was instantiated, and copied the ssh public key into that account. Note that your old account is unchanged and may still be used. You can update the public keys for that old user using **sudo** and the ```ec2-user``` account.
    * *The /staging partition is only properly mounted for batch processing.* You may see ```/staging``` on a migrated VM, but it will not have any additional space beyond what is in the root partition.

* **Snapshot (save) a VM Instance** Save the state of your VM by navigating to the **Instances** window, and clicking on the **Create Snapshot** button to the right of your VM instance's name. After selecting a name for the snapshot (can be identical to previous image names, as images also have unique UIDs associated with them), click the **Create Snapshot** button. It will eventually be saved and listed in the **Images** window, and will be available next time you launch an instance.

* **Shut down a VM Instance** In the **Instances** window, select ```Terminate Instance``` in the **More** pull-down menu, and confirm.

## Batch processing



{% include backToTop.html %}
