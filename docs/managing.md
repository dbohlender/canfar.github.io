---
layout: docs
title: Managing Virtual Machines
permalink: /docs/vmod/
---

## Prepare the command-line interface

There are multiple methods for interacting with an OpenStack
cloud including the [dashboard](http://www.openstack.org/software/openstack-dashboard/), [command-line interface (CLI)](http://docs.openstack.org/user-guide/content/ch_cli.html), and a [Python API](http://docs.openstack.org/developer/python-novaclient/api.html), all of which are based on an underlying [RESTful API](http://developer.openstack.org/api-ref.html).

A good starting point for programatic interactions with OpenStack is the CLI, which we introduce here. Some tutorials that go into greater depth may be found [here](http://www.cybera.ca/projects/cloud-resources/rapid-access-cloud/documentation).

### Install clients

The CLI clients can be installed though the package systems of modern Linux distributions. Here we will use **nova** and **glance** (the compute and image services, respectively).

For Debian-based distribution (e.g., Ubuntu):
{% highlight bash %}
$ sudo apt-get install python-novaclient python-glanceclient
{% endhighlight %}

For Redhat Enterprise-based distributions (e.g., Scientific Linux, CentOS):
{% highlight bash %}
$ sudo yum install python-novaclient python-glanceclient
{% endhighlight %}

Alternatively, to get the latest versions, install using **pip**:
{% highlight bash %}
$ sudo pip install python-novaclient python-glanceclient
{% endhighlight %}

### Setup the environment

The OpenStack CLI uses environment variables to store the URLs for services, user credentials, and the active tenant. The simplest way to set these variables is by sourcing an **openrc** file, which may be obtained from the dashboard for your particular tenant. In the **Access & Security** panel switch to the **API Access** tab and then click on **Download OpenStack RC File** at the top-right.

## Interact with the image service

### List virtual machine images
List VM images available to the current tenant (including public images, images shared with this tenant, and private images):
{% highlight bash %}
$ glance image-list
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
| ID                                   | Name                              | Disk Format | Container Format | Size        | Status |
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
| 7524b433-7f3f-4c0b-808b-09420791baae | CentOS 6.5 Base                   | qcow2       | bare             | 344457216   | active |
| a4728b62-d15f-4e10-8475-1481ea3037d4 | CentOS 7                          | qcow2       | bare             | 339471872   | active |
| 501deaf8-9101-4a95-adfd-9e70fda8458b | Test Image                        | qcow2       | bare             | 255263232   | active |
| 79c972b6-7aa6-47a5-8b46-404552a65d1e | ubuntu-server-14.04-amd64         | qcow2       | bare             | 255787520   | active |
| e8bc9e1d-495c-4d17-90fb-68d9d6a128c1 | uCernVM-devel.1.18-2              | raw         | bare             | 20971520    | active |
| 24ea1c95-968b-4914-b3c9-a754e342bd6b | ucernvm-prod.1.18-2               | raw         | bare             | 20971520    | active |
| ac787d9b-bb34-4741-b4a4-4a8126a44225 | Windows Server 2012 R2 Evaluation | raw         | bare             | 17182752768 | active |
+--------------------------------------+-----------------------------------+-------------+------------------+-------------+--------+
{% endhighlight %}

### Download a virtual machine image
Download the CentOS 6.5 Base image to a local file called centos6.5_base.qcow2 (note ID of the image in the output of ```glance image-list```):
{% highlight bash %}
$ glance image-download --file centos6.5_base.qcow2 7524b433-7f3f-4c0b-808b-09420791baae
{% endhighlight %}

### Upload a virtual machine image
Copy a virtual image file named ```new_vm.qcow2``` from the local file system to the image service:
{% highlight bash %}
$ glance image-create --name=new_vm --container-format=bare --disk-format=qcow2 < new_vm.qcow2
{% endhighlight %}

### Share an image with another tenant
If you wish to make a virtual machine image available to another tenant (read-only), it can be shared by "adding members" to that VM's metadata:
{% highlight bash %}
$ glance member-create <IMAGE> <TENANT_ID>
{% endhighlight %}
where ```IMAGE``` can be either the ID or the name (output of ```glance image-list```) of the image, and ```TENANT_ID``` is the ID of the target tenant (i.e., ```OS_TENANT_ID``` in openrc file).

## Launching and interacting with virtual machine instances

### Preparation
Before launching an instance of a virtual machine, some preparation is needed:

* Create a **security group** (essentially firewall rules). Usually you want to enable ssh access.
* Create a **keypair**. Your public key will be injected into a generic user account to give you access to the VM.
* Allocate an **IP address** to your tenant.

[This tutorial](https://docs.google.com/document/d/1zxnuyi1NoO-Hi52OWpmQZKu4dD3DipvZB-fy91mZ18Q/edit#heading=h.3znysh7) describes these steps in detail.

### Launch the instance

You will need to select a **flavor** (hardware profile) for the instance. List available flavors:

{% highlight bash %}
+----+-----------+-----------+------+-----------+------+-------+-------------+-----------+
| ID | Name      | Memory_MB | Disk | Ephemeral | Swap | VCPUs | RXTX_Factor | Is_Public |
+----+-----------+-----------+------+-----------+------+-------+-------------+-----------+
| 1  | m1.tiny   | 512       | 1    | 0         |      | 1     | 1.0         | True      |
| 2  | m1.small  | 2048      | 20   | 0         |      | 1     | 1.0         | True      |
| 3  | m1.medium | 4096      | 40   | 0         |      | 2     | 1.0         | True      |
| 4  | m1.large  | 8192      | 80   | 0         |      | 4     | 1.0         | True      |
| 5  | m1.xlarge | 16384     | 160  | 0         |      | 8     | 1.0         | True      |
+----+-----------+-----------+------+-----------+------+-------+-------------+-----------+
{% endhighlight %}
Note that ```Disk``` is the size of the root partition in GB. **m1.small** is the smallest usable flavor for most Linux images.

Next, launch an instance:
{% highlight bash %}
$ nova boot --flavor m1.small --image 007e7156-964e-43b6-ab7c-bdc86a922365 --security_groups "default" --key_name "mykey" "new_instance"
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
| flavor                               | m1.small (2)                                        |
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
{% endhighlight %}
where possible image IDs can be obtained with ```glance image-list```, security groups with ```nova secgroup-list```, and keypairs with ```nova keypair-list```.

Check the status of running instances:
{% highlight bash %}
$ nova list
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
| ID                                   | Name         | Status | Task State | Power State | Networks                                      |
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
| de7afe99-a559-4744-bab7-fbc30e85fcfc | new_instance | ACTIVE | -          | Running     | CANFAROps_network=192.168.20.89               |
+--------------------------------------+--------------+--------+------------+-------------+-----------------------------------------------+
{% endhighlight %}

### ssh to running instance

Assign a floating IP so that you can access it:
{% highlight bash %}
$ nova floating-ip-associate new_instance 206.12.48.93
{% endhighlight %}
Available IP addresses can be listed using ```nova floating-ip-list```. If you wish to disassociate the IP (in order to make it available for another VM), use ```nova floating-ip-disassociate```.

Then you can **ssh** to the VM. If you do not know the name of the generic user account into which your SSH key has been injected:
{% highlight bash %}
$ ssh root@206.12.48.93
Please login as the user "cloud-user" rather than the user "root".

$ ssh cloud-user@206.12.48.93
[cloud-user@new-instance ~]$
{% endhighlight %}

### snapshot a running instance

A snapshot of a running instance produces a new virtual machine image reflecting the current state of the instance (execute from outside of the instance):

{% highlight bash %}
$ nova image-create new_instance new_image
{% endhighlight %}

It will then be visible to ```glance image-list``` with the name ```new_image```.

### shut down an instance

Shut down the instance:

{% highlight bash %}
$ nova stop new_instance
{% endhighlight %}

{% include backToTop.html %}
