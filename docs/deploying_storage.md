---
layout: docs
title: Deploying CADC/CANFAR storage management and data access services
permalink: /docs/deploying_storage/
---

#Deploying CADC/CANFAR storage management and data access services

CADC/CANFAR data access is managed through two layers: web services and storage management.

The web services are the only point of access for users to the CADC/CANFAR data.  All authorization, authentication, download, and upload of data are done through CADC- and CANFAR-specific http- and https-based Java services running on the web service nodes.

All user interactions with the storage sub-system are proxied through these web services.   Any web services at remote sites will need access to not only the storage management sub-systems at that site but also to the metadata at CADC.  (See the connection diagram below.)  The user metadata (used for authorization and authentication) are currently only stored at the CADC.

There are two main storage sub-systems comprising the CADC/CANFAR data management system (AD) -- excluding the storage metadata which is only housed at the CADC: the cache nodes and storage service nodes.  The cache nodes are meant to allow efficient writes of data through the web services whereas the storage service nodes provide the bulk storage for the CADC/CANFAR data.  While the software configuration and management of these two classes of nodes are very similar, they are treated quite differently within the data management system.  Cache nodes must each be paired with an identical node at the same site: data being written to the cache through the web services is streamed simultaneously to both nodes, ensuring some degree of redundancy. Storage service nodes must be paired with similar nodes, but these nodes can be located at geographically different sites: data is asynchronously migrated from the cache to these nodes, and among the storage nodes to ensure consistency.   The combination of cache nodes, storage nodes, pairing across separate sites, and data consistency ensured by AD results in the geographically distributed file storage system used by CADC/CANFAR.

The cache nodes themselves are simple HTTP servers each with directly accessible storage (directly attached disks or LUNs, or storage volumes in the case of virtual machines) -- multiple disks per node are required to avoid contention for any one disk: the software used to determine the location written to will balance the writes across these disks, and it requires this physical layout to function properly.  Note that the contention in this case can be on AD metadata resources governing the use of that disk, not just the physical storage.  The cache (and storage) nodes use standard file-systems on the disks.  The cache nodes are written to by the web services only, but the data stored there can be accessed by other web services and the storage service nodes.  Files will usually only reside on the cache nodes for a few hours until they are migrated to the storage nodes.  

The storage nodes (or storage service nodes) are similar to the cache nodes: the host runs two separate HTTP instances, and has access to a dedicated (non-NFS) file-system (or multiple file-systems) for storing data.  The two HTTP instances (also used on the cache nodes) are there for privilege separation -- one instance runs as a privileged user and can read and write data, the other instance runs as an unprivileged user and can only read data.  The web services nodes can only access the data on the storage service nodes via the unprivileged HTTP instance.  

Unlike the cache nodes, the storage service nodes at one site can be paired in AD to nodes at another site.  AD will ensure -- through asynchronous data management processes that run on the nodes -- that the data on each paired node is ‘eventually consistent’.  Despite the fact that this replication is asynchronous, requests for any file will only be directed to sites where the newest version of the file exists: from the point of view of the user, the storage is always consistent.  Besides the data replication processes that run on the nodes, there are also data verification and clean-up processes that run, ensuring the consistency of the data.  Depending on the rate of arrival of new data, and the volume of data on a node, these management processes can be resource (cpu, memory) and read intensive: because of this, it is recommended that there be multiple storage service nodes at each site.

Besides serving raw files, both cache and storage nodes can manipulate data before it is streamed back to the web service nodes: this data manipulation is done through the use of CGIs on the unprivileged HTTP instance.  The number of such data processes running on a node is determined by the number of requests coming in: again, this means that each storage service node should have generous cpu and memory resources to accommodate these processes; scaling horizontally by having several nodes is also possible.

A caution with regards to pairing of nodes between sites.  AD is fairly simplistic in how it views storage resources and the pairing of nodes.  Each disk on a node (storage or cache) is split into one or more volumes.  It is these volumes that are mirrored between pairs of nodes.  AD will try to mirror all of the volumes from one disk on one node with one disk on the other node: so, by default, it is assumed that a disk on a new node will be equal in size or larger than a disk on an existing node.  Currently, this behaviour can only be modified with manual (and difficult) intervention.  

Note that AD does not have the concept of a ‘read-only’ node: all nodes are expected to be able to accept writes (through the privileged HTTP instance).

![CADC/CANFAR Storage sub-systems and connections](https://github.com/canfar/docs/blob/master/images/CADC_CANFAR_subsystems.png)

##AD Deployment

###Storage management

1. Deploy storage service nodes

    * Recommended minimum requirement: 4 nodes/VMs (64GB RAM, 16 cores), each with access to file-systems (not NFS) on dedicated storage volumes.  If there are more nodes, each node can have lower physical requirements.  A 10Gb network connection, or greater, is recommended.  Virtual machines would work, provided that they and the host machine have sufficient access to dedicated storage and other resources.
    
    * Considerations: 

        * each node will house some fraction of the CADC/CANFAR data collection (currently over 700TB, expected to be 840TB by the end of 2016).  Each site is required to have enough storage to hold one or more copies of the entire collection.

        * Files will be served from these nodes to the web services nodes in parallel with data being written (asynchronous migration), and other data management applications running.  

        * The data being stored on these nodes will be mirrored with data at other sites: consideration needs to be paid to the distribution of data at these sites for optimal usage of storage.  

        * Each node should have independent data storage (i.e. different LUNs/disks).  A shared file-system is not required.  NFS is not recommended.

    * The configuration of the storage services nodes is contained within a Puppet module which will need to be used to ensure all configuration is done properly, but the basic configuration is as follows:

        * Each node is required to run two  HTTP servers (one running as a privileged user (cadcops) and one as a non-privileged user (apache)), run data verification (data integrity) and migration processes (data consistency), and data operation services (currently cut-outs on specific file-types)

        * data operation services currently run as CGIs on the non-privileged HTTP instance.

        * ‘cadcops’ user must exist.  Account must be accessible via ssh from remote storage sites.

        * ‘cadcsw’ user must exist: write access to a local /usr/cadc file-system (20GB)

        * Data access:

            * Storage must be writable by local ‘cadcops’ user, readable by local ‘apache’ user

            * HTTP put:  

                1. via webdav (mod_webdev on apache httpd) on port 8787

                2. HTTP instance must run as cadcops user to allow writes

            * HTTP get:

                3. port 8888

                4. HTTP instance should run as apache

                5. CGI access to locally installed CADC executables must be allowed.

            * HTTP server DocumentRoot must be the top-level directory of the data storage.

            * Access to port 8787 (write) must be allowed from:

                6. local web service nodes

            * Access to port 8888 (read) must be allowed from:

                7. local web service nodes

                8. All remote storage sites

        * Require access to central storage RDBMS (currently @CADC)

            * Currently sybase-active.cadc.dao.nrc.ca:4100

    * Responsibilities:

        * Software development and deployment: CADC

            * no new software required for development

        * Physical infrastructure: CC

        * Service configuration: CADC

2. Deploy cache nodes

    * Minimum requirement: 4 nodes (32GB RAM, 12 cores), each with access to several (8-12) fast disks (each ~300GB).  These nodes are separate from the above storage service nodes, but the configuration is very similar.

    * As for the storage nodes, the detailed configuration is contained in a Puppet module which will need to be used to ensure the configuration is correct.

    * Each node is required to run an optimized HTTP server for PUT/GET operations of data, run data verification (data integrity) and migration processes (data consistency), and data services (currently cut-outs on specific file-types).

        * Data access requirements as for above storage service nodes	

    * Require access to central storage RDBMS (currently @CADC)

    * Not required to be publicly accessible

    * Responsibilities:

        * Software development and deployment: CADC

            * no new software required for development

        * Physical infrastructure: CC

        * Service configuration: CADC

##Data delivery

1. Web services

    * Four or more physical nodes or VMs, each capable of running several service containers (48GB RAM, 16 cores)

        * Each container will run one Apache tomcat instance each with one or more java webapps.  These services and containers will be built and configured by CADC

        * Mappings from container ports to host ports need to be agreed upon at outset

        * A shared file-system for all containers should be made available for log files, and CADC will need access to this file-system.

    * Detailed configuration of the web services nodes are contained in a Puppet module.  Basic configuration is described below:

        * Require access to central RDBMS (currently @CADC), Access control metadata (@CADC), Storage service nodes, Cache nodes.

            * see above for port access

        * Port 80, 443 required to be publicly accessible

    * Responsibilities:

        * Software development: CADC

            * no new software required for development

        * Physical infrastructure and container deployment mechanism: CC

        * Service configuration: CADC

