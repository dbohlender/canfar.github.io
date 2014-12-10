---
layout: docs
title: Virtual Machine Command-line Interface
permalink: /docs/cli/
---

<div class="span-4 module-table-contents margin-top-large">
	<h2>Table of contents</h2>
  <ol class="column-2">
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#install-clients">Install Clients</a></li>
    <li><a href="#import-virtual-machine-images">Import virtual machine images</a></li>
    <li><a href="#sharing-virtual-machine-images">Sharing virtual machine images</a></li>
    <li><a href="#managing-virtual-machine-instances">Managing virtual machine instances</a></li>
</ol>
</div>
<div class="clear"></div>

## Introduction

There are multiple methods for interacting with an OpenStack cloud including the [dashboard](http://www.openstack.org/software/openstack-dashboard/), [command-line interface (CLI)](http://docs.openstack.org/user-guide/content/ch_cli.html), and a [Python API](http://docs.openstack.org/developer/python-novaclient/api.html), all of which are based on an underlying [RESTful API](http://developer.openstack.org/api-ref.html).

A good starting point for programatic interactions with OpenStack is the CLI, which we introduce here. Some tutorials that go into greater depth may be found [here](http://www.cybera.ca/projects/cloud-resources/rapid-access-cloud/documentation).

{% include backToTop.html %}

## Install Clients

The CLI clients described in this document are available on the CANFAR batch host ```batch.canfar.net```. However, as disk space is limited, it is advisable to install the clients on your own machine.

The easiest method is to use the package system of a modern Linux distribution. In this document we will use the **nova** and **glance** clients (for the compute and image services, respectively).

For Debian-based distributions (e.g., Ubuntu):
```
sudo apt-get install python-novaclient python-glanceclient
```

For Redhat Enterprise-based distributions (e.g., Scientific Linux, CentOS):
```
sudo yum install python-novaclient python-glanceclient
```

Alternatively, to get the latest versions, install using **pip** (which may first require installation of the ```python-pip``` package using either ```apt-get``` or ```yum``` as above):
```
sudo pip install python-novaclient python-glanceclient
```

### Setup the environment

The OpenStack CLI uses environment variables to store the URLs for services, user credentials, and the active tenant. The simplest way to set these variables is by sourcing an **openrc** file, which may be obtained from the dashboard for your particular tenant. In the **Access & Security** panel switch to the **API Access** tab and then click on **Download OpenStack RC File** at the top-right.

{% include backToTop.html %}

## Import virtual machine images

Virtual machine images reside in the OpenStack cloud's image repository, and are accessed through the image service, **glance**. All images are associated with an OpenStack **tenant** (synonymous with **project** in OpenStack terminology), which is a single resource allocation. Within the CANFAR ecosystem, OpenStack tenants also correspond to **CANFAR groups with processing privileges**. Users may be members of multiple CANFAR processing groups, and each group may have multiple CANFAR users.

### List virtual machine images

A VM image is normally only accessible to members of its tenant. However, there are a number of public images that are provided as a base upon which all users may build more complicated VMs. To list the images (both public and private) accessible to members of the current tenant:

```
glance image-list
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
| ID                                   | Name                              | Disk Format | Container Format | Size        | Status |
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
| 7524b433-7f3f-4c0b-808b-09420791baae | CentOS 6.5 Base                   | qcow2       | bare             | 344457216   | active |
| a4728b62-d15f-4e10-8475-1481ea3037d4 | CentOS 7                          | qcow2       | bare             | 339471872   | active |
| 79c972b6-7aa6-47a5-8b46-404552a65d1e | ubuntu-server-14.04-amd64         | qcow2       | bare             | 255787520   | active |
| e8bc9e1d-495c-4d17-90fb-68d9d6a128c1 | uCernVM-devel.1.18-2              | raw         | bare             | 20971520    | active |
| 24ea1c95-968b-4914-b3c9-a754e342bd6b | ucernvm-prod.1.18-2               | raw         | bare             | 20971520    | active |
| ac787d9b-bb34-4741-b4a4-4a8126a44225 | Windows Server 2012 R2 Evaluation | raw         | bare             | 17182752768 | active |
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
```

### Requirements

Prior to importing images from an external source, become familiar with the [requirements](http://docs.openstack.org/image-guide/content/ch_openstack_images.html) for operability in an OpenStack cloud. Starting with one of the public base images is always a good idea, although modern cloud images from major Linux distributions will often work without modifications. In addition, previously-created images for the old CANFAR processing system (images stored in user VOSpace) have already been migrated for compatibility, and should have been uploaded to the image service on your behalf.

### Upload a virtual machine image

Once you have an image ready, it can be uploaded to the image service directly from the local filesystem. For example:
```
glance image-create --name=new_vm --container-format=bare --disk-format=qcow2 < new_vm.qcow2
```
Here, the image disk format is **QCOW2** which compresses empty portions of the image, saving both file transfer and instantiation time. A [number of formats are supported](http://docs.openstack.org/image-guide/content/image-formats.html), and a good tool for converting between them is [qemu-img](http://docs.openstack.org/image-guide/content/ch_converting.html).

### Download a virtual machine image

Images may also be downloaded to the local filesystem. For example, download the ```CentOS 6.5 Base``` image to a local file called ```centos6.5_base.qcow2``` (note ```ID``` of the image in the output of ```glance image-list```, and we have also chosen a file extension matching the ```Disk Format```):
```
glance image-download --file centos6.5_base.qcow2 7524b433-7f3f-4c0b-808b-09420791baae
```

{% include backToTop.html %}

## Sharing virtual machine images

There are multiple ways to share your VM images. In addition to simply downloading the image from the image service and providing it to a collaborator (who may then upload it to their own tenant), there are other options that do not require making new copies.

### Share an image with another tenant

If another user already has a CANFAR group with processing privileges (and corresponding OpenStack tenant), you can simply make the VM visible (read-only) to their tenant, enabling them to launch their own instances.

First, request the ```tenant_id``` for the target tenant (i.e., ```OS_TENANT_ID``` in the other user's openrc file). Then, **add members** to your VM's metadata:
```
glance member-create [image] [tenant_id]
```
where ```[image]``` can be either the ID or the name (output of ```glance image-list```) of the image in question. If using the dashboard, these images will then be visible from the target tenant in the **Images** window under the **Shared with Me** tab, as well as ```glance image-list``` from the command line.

### Add users to your CANFAR processing group

Another option is to add a user to your CANFAR processing group through the [group management pages](http://www.canfar.phys.uvic.ca/canfar/groups/). Note, however, that *all* images in your tenant, as well as your VMOD (interactive) processing allocation will also be available to them.

{% include backToTop.html %}

## Managing virtual machine instances

### Preparation
Before launching an instance of a virtual machine, some preparation is needed:

* Create a **security group** (essentially firewall rules). Usually you want to enable ssh access.
* Create a **keypair**. Your public key will be injected into a generic user account to give you access to the VM.
* Allocate an **IP address** to your tenant.

The [CANFAR tutorial](../tutorial/#virtual-machine-on-demand) describes these steps using the dashboard. The equivalent steps from the command line are covered in [this tutorial](https://docs.google.com/document/d/1zxnuyi1NoO-Hi52OWpmQZKu4dD3DipvZB-fy91mZ18Q/edit#heading=h.3znysh7).

### Launch the instance

You will need to select a **flavor** (hardware profile) for the instance. List available flavors:

```
nova flavor-list
+--------------------------------------+---------+-----------+------+-----------+------+-------+-------------+-----------+
| ID                                   | Name    | Memory_MB | Disk | Ephemeral | Swap | VCPUs | RXTX_Factor | Is_Public |
+--------------------------------------+---------+-----------+------+-----------+------+-------+-------------+-----------+
| 13efd2a1-2fd8-48c4-822f-ce9bdc0e0004 | c16.med | 122880    | 20   | 780       |      | 16    | 1.0         | True      |
| 23090fc1-bdf7-433e-9804-a7ec3d11de08 | c2.med  | 15360     | 20   | 80        |      | 2     | 1.0         | True      |
| 3fb8ebe8-b42b-40a5-b1b8-943461e258c6 | c2.hi   | 23040     | 20   | 80        |      | 2     | 1.0         | True      |
| 5112ed51-d263-4cc7-8b0f-7ef4782f783c | c4.hi   | 46080     | 20   | 180       |      | 4     | 1.0         | True      |
| 6c1ed3eb-6341-470e-92b7-5142014e7c5e | c2.low  | 7680      | 20   | 80        |      | 2     | 1.0         | True      |
| 72009191-d893-4a07-871c-7f6e50b4e110 | c8.med  | 61440     | 20   | 380       |      | 8     | 1.0         | True      |
| 8061864c-722b-4f79-83af-91c3a835bd48 | c4.low  | 15360     | 20   | 180       |      | 4     | 1.0         | True      |
| 8953676d-def7-4290-b239-4a14311fbb69 | c8.low  | 30720     | 20   | 380       |      | 8     | 1.0         | True      |
| a0cff077-097e-4931-a902-5aeb3a02ed05 | c4.med  | 30720     | 20   | 180       |      | 4     | 1.0         | True      |
| a55036b9-f40c-4781-a293-789647c063d7 | c8.hi   | 92160     | 20   | 380       |      | 8     | 1.0         | True      |
| d816ae8b-ab7d-403d-ae5f-f457b775903d | c16.hi  | 184320    | 20   | 780       |      | 16    | 1.0         | True      |
| e7346bd7-cae6-41e3-9235-5f18ba36edf1 | c16.low | 61440     | 20   | 780       |      | 16    | 1.0         | True      |
+--------------------------------------+---------+-----------+------+-----------+------+-------+-------------+-----------+
```
Note that ```Disk``` is the size of the root partition in GB. ```Ephemeral``` is an additional (typically large) block device that provides fast temporary storage. **c2.low** is the smallest usable flavor for most Linux images.

Next, launch an instance:
```
nova boot --flavor c2.low --image 007e7156-964e-43b6-ab7c-bdc86a922365 --security_groups "default" --key_name "mykey" "new_instance"
+--------------------------------------+-----------------------------------------------------+
| Property                             | Value                                               |
+--------------------------------------+-----------------------------------------------------+
| OS-DCF:diskConfig                    | MANUAL                                              |
| OS-EXT-AZ:availability_zone          | nova                                                |
| OS-EXT-STS:power_state               | 0                                                   |
| OS-EXT-STS:task_state                | scheduling                                          |
| OS-EXT-STS:vm_state                  | building                                            |
| OS-SRV-USG:launched_at               | -                                                   |
| OS-SRV-USG:terminated_at             | -                                                   |
| accessIPv4                           |                                                     |
| accessIPv6                           |                                                     |
| adminPass                            | Ksy63C6dNYZp                                        |
| config_drive                         |                                                     |
| created                              | 2014-11-23T04:22:43Z                                |
| flavor                               | c2.low (2)                                          |
| hostId                               |                                                     |
| id                                   | de7afe99-a559-4744-bab7-fbc30e85fcfc                |
| image                                | migrated_sl6 (007e7156-964e-43b6-ab7c-bdc86a922365) |
| key_name                             | mykey                                               |
| metadata                             | {}                                                  |
| name                                 | new_instance                                        |
| os-extended-volumes:volumes_attached | []                                                  |
| progress                             | 0                                                   |
| security_groups                      | default                                             |
| status                               | BUILD                                               |
| tenant_id                            | 34dd80b8e3984a968f559861433e0d11                    |
| updated                              | 2014-11-23T04:22:42Z                                |
| user_id                              | echapin-canfar                                      |
+--------------------------------------+-----------------------------------------------------+
```
where possible image IDs can be obtained with ```glance image-list```, security groups with ```nova secgroup-list```, and keypairs with ```nova keypair-list```.

Check the status of running instances:
```
nova list
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
| ID                                   | Name         | Status | Task State | Power State | Networks                                      |
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
| de7afe99-a559-4744-bab7-fbc30e85fcfc | new_instance | ACTIVE | -          | Running     | CANFAROps_network=192.168.20.89               |
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
```

### ssh to running instance

Assign a floating IP so that you can access it:
```
nova floating-ip-associate new_instance [floating ip]
```
Available values of ```[floating ip]``` can be listed using ```nova floating-ip-list```. If you wish to disassociate the IP (in order to make it available for another VM), use ```nova floating-ip-disassociate```.

You can then **ssh** to the VM. If you do not know the name of the generic user account into which your SSH key has been injected, initially try to enter as root and it will tell you the correct name:

```
ssh root@[floating ip]
Please login as the user "cloud-user" rather than the user "root".
```
```
ssh cloud-user@[floating ip]
```

### snapshot a running instance

A snapshot of a running instance produces a new virtual machine image reflecting the current state of the instance (execute from outside of the instance):

```
nova image-create new_instance new_image
```

It will then be visible to ```glance image-list``` with the name ```new_image```.

### shut down an instance

Shut down the instance:

```
nova stop new_instance
```

{% include backToTop.html %}
