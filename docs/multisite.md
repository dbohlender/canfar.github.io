---
layout: docs
title: Plan for CANFAR Multi Site Cluster Batch Processing
permalink: /docs/multisite/
---

The CANFAR batch processing infrastructure is currently running on a single cluster orchestrated on one OpenStack cloud with ComputeCanada. CANFAR used to run on 4 clusters at 3 different clouds with Nimbus infrastructure, although with lesser amount of total resources. Multi site clusters were handy for cloud bursting and giving users higher availability and allowing specific hardware resources separation. To achieve reliable, efficient and scalable multi-sites batch processing would probably require a new design work flow. We describe here how we would need to do multi site clusters batch processing with OpenStack sites operated by ComputeCanada the most direct way.

In order to achieve multi-site scheduling with the current CANFAR design, we need to deploy a batch scheduler server on each cluster, a central manager to collect job queues and schedules clusters, as well as a user portal hosting a job submission engine and a virtual machine management.

Below is a table of the rounded number of idle and running jobs and Virtual Machines since the beginning of operational OpenStack migration in January 2015 and what we would like to achieve ones for multi-site clusters. Although the main gain with multi-site clustering is high availability, we are planning on gaining on efficiency as a side effect of over scheduling.


 Number of   | Average<br>Now | Peak<br>Now |  Average<br>Planned   |  Peak<br> Planned
-------| -------:|---------:| -------:|------:
Running Jobs| 150     | 1,100    |  300    | 2,000
Idle Jobs  | 100,000 | 300,000  | 100,000 | 300,000
VMs / day|  300    | 2,500 |   1500    |  3,000  |


The batch scheduler server hosts the services launching batch jobs. Batch jobs in CANFAR consists of running user submitted jobs on user launched Virtual Machines.

![Multi site cluster architecture](../../img/canfar_multi_cluster.png)

## Cluster Resources

The CANFAR resource allocation define the resource quota in each cloud. Given the archive and VOSpace data location, we will host storage resources closer to the worker VMs to minimize network traffic. Each cloud should have one CANFAR batch tenant with all the allocated quota for batch processing. In each cloud, only the storage replica is shared among Virtual Machines. 

  
## Central Manager

The central manager gathers all user job submissions, collect job status and negotiate job requirements with available resources. Because user software stack in CANFAR is VM based, a VM instance manager monitors the job queue and launches or shutdowns VMs according to the job requirements across clouds. To make sure the same VM image is used in all clouds, we used to have a common VM HTTPS based repository. With the current implementation of OpenStack, the image repository is local to the cloud, so we need to synchronize repositories across clouds.

Central Manager  requirements: 

 - 16GB RAM, 8 cores, 1TB for data, 1 public IP
 - `HTCondor` setup for  `COLLECTOR` and `NEGOTIATOR`
 - scheduler for VM instances between cloud: `cloudscheduler`
 - synchronization server side of VM images between clouds: `glint-service`
 - cloud clients for instance and image management: `OpenStack nova` and `glance`
 - contextualization for worker VMs with `cloud-init`  generated files for `HTCondor` and `GlusterFS` configuration

## Storage

To manage data inputs and outputs in batch jobs, most users transport their data on remote servers which are accessible via HTTP clients to the CANFAR VOSpace storage service or the CANFAR data web service. We have two layers of storage to maximize data transfers with either HTTP or POSIX storage.

### Cache Storage

The cache storage is described in more details in the "Mirroring Storage" document which we summarize here.  The cache storage is designed for fast writes of incoming data from processing VMs through the web services.  The cache nodes consists of HTTP servers with local disk storage.  Cache storage will keep a file for a few hours at most.

Cache storage requirements:

 - 4 nodes 32GB RAM, 12 cores, 3TB fast access disk
 - CANFAR cache storage software stack


### POSIX Storage

The current CANFAR VOSpace storage implementation is inefficient for small files, failover procedures are not scalable, and connect to a single point of failure in the CANFAR central services.  As a workaround to those reliability issues, we are also offering a shared file system for specific users accessible as read-only to their VMs. It is not linked to the CANFAR identity services, it has been so far tailored only for critical users. It is also not setup for intensive fast i/o such as HPC situations. It consists of a distributed shared file system with POSIX access on regular cloud managed block devices, with geographical replication.

We also would like to carry on the capability of large POSIX shared file storage accessible for users. Many astronomy legacy software only work with POSIX access to file systems. Given the complexity of delegating single user authorization across clusters and VMs and the scope of this proposal, we would restrict the file system as read-only and public.

Read-write master requirements:

 - 16GB RAM, 4 cores, 100TB of POSIX accessible storage, 1 public IP, 2x10GigE ethernet
 - SSH access for CANFAR users to setup their data
 - shared file server`GlusterFS` with geo replication setup as master

Read-only slave replica requirements:

 - 16GB RAM, 4 cores, 100TB of POSIX accessible storage, 1 public IP
 - same network as the worker instances
 - shared file server `GlusterFS`  with geo replication setup as slave
 
## User Job Management

Users develop code and test on VMs within their own resources not shared with batch services. To submit, manage and analyze jobs, CANFAR users can either use a batch web service for basic job management, or use command line clients on a dedicated server. User VMs need to be shared with a dedicated batch tenant. 

User job management dedicated server requirements:

 - 24GB RAM, 4 cores,  200GB of SSD for OS disk, 2TB of data disk (bare metal if number of running jobs > 5,000 to speed up disk i/o)
 - job scheduler`HTCondor` configured for the `SCHEDD` daemon
 - OpenStack `glance` clients to share images between user tenants and batch tenant
 - CANFAR batch web service (tomcat based)
 - job submission command line CANFAR wrappers
   
## Scalability

With the elasticity of current cloud infrastructures, scaling up is only an issue of acquiring more resources either by increased allocation time on private clouds, or by credit card on public clouds. 
Each component of the user layer can be replicated and thus distribution is made easy. However the central manager is still a single point of failure. In practice, replicating HTCondor collector is possible though not without difficulties. Other components of the central manager are not ready for automatic scalability with large increase of  either the number of users or number of tenants.

## Tasks

1. Resource deployment

	VM and bare metal instances are launched according to the resource needs described above. The base OS is either Ubuntu Server or CentOS.

2. Software installation

	We want to manage all the servers automatically to be able to ease disaster recovery, so we will use a configuration management system to deploy all the software and updates to bare metal or VM servers described above. Monitoring and alerting are also needed on each configured servers to report back to the CANFAR central monitoring service.  We will therefore need the following extra software for each deployed server instance:
	* configuration management `puppet` agent to automate updates
	* collector agent `logstash` to report the CANFAR monitoring and analytics services
	* alert engine `nagios` or `prometheus` to quickly respond to failures.

3. Deployment

	We will test and iterate the automated deployment of the CANFAR batch VMs on the clouds. Critical alpha users will run a thousands of jobs while we monitor the proper scheduling of the job,  scalability of the storage access both to VOSpace and local.

4. Release

	Given successful deployment with alpha users, we will release the operational multi site cluster to CANFAR users.
