The CADC VOSpace is a network-based file storage system, an implementation of the [Virtual Observatory Specification](http://www.ivoa.net/Documents/VOSpace/). VOspace allows users to store and retrieve files over the network using a set of command line tools, or via a webpage interface. Optionally, VOspace can also be mounted as a file system. VOSpace also allows users to share data with others, either publicly or with a restricted set of other users. VOspace is intended to store the output of CANFAR data processing, but can also be used to share data from other sources. Files in VOSpace are mirrored in two physical locations and backed-up to off-site storage, so they are secure against disk failure.

This user guide describes how to use VOspace.

Terminology
-----------

There are few terms which may not be familiar to some users:

-   **nodes:** Nodes are equivalent to directories and files. A containerNode is a directory, a dataNode is a file.
-   **access groups:** If you have proprietary data at CADC you should already be familiar with access groups. An access group is a list of CADC users who have access to data.
-   **owner:** The user whose CADC user\_id was used to create a VOSpace becomes its owner, authorized to add and remove nodes (files and directories) from the space. An owner is automatically an administrator for the access control group, able to add and remove members from the group.
-   **certificate:** A certificate is a mechanism for authenticating users without forcing them to log in with a user\_id and password for every operation. Certificates are like ssh keys with an expiration date. See [Security Certificates](#Security_Certificates "wikilink"), below.

Creating a new VOSpace
----------------------

-   To arrange for your VOSpace to be created, send an e-mail to [mailto:canfarhelp@nrc-cnrc.gc.ca](mailto:canfarhelp@nrc-cnrc.gc.ca) with your space requirements in GB or TB, your CADC user\_id and a very brief justification (1 or 2 sentences only; if we need more information we will contact you).
-   Be realistic in your space request. If you later find that you need your quota increased, this can be done fairly easily.
-   By default, a new access group will be created with the requesting user as the owner of the VOSpace and the only member authorized to read and write files, and to add new members to the access group(s). See [Access Control for Proprietary VOSpaces](#Access_Control_for_Proprietary_VOSpaces "wikilink"), below.

Tools to access data in a VOSpace
---------------------------------

We have implemented the following interfaces to move data in and out of a VOSpace:

-   [Web-based user interface](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vosui), which provides a friendly front end to our service.
-   a variety of command line tools:
    -   [Java client](Java client "wikilink"): provides a complete command set. This method is the most reliable, but hardest to use.
    -   [Python tools](Python tools "wikilink"): that provide Linux-like commands for basic operations
    -   [Perl tools](Perl wrapper scripts "wikilink"): provide Linux-like commands for basic operations as wrapper scripts for the java client

-   [VOSpace mounted as a file system](Python_tools#VOSpace_FileSystem "wikilink") which makes VOspace look like a local disk. Beware that although a VOSpace may look like a local disk, it has a very different implementation. Disk-oriented tools like *rsync* interact very badly with VOSpace. To move large volumes of data in or out of a VOSpace, it is better to use one of the command line tool sets.

Access Control for Proprietary VOSpaces
---------------------------------------

-   Proprietary access requires a CADC account, which can be [requested through our registration page](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html).
-   New users can request access to an existing proprietary VOSpace by sending a message including your CADC user\_id to the owner of the VOSpace.
-   Normally, two access groups are created when a new VOSpace is created: the read group and the write group. They will have names like: gmarx-VOS-read and gmarx-VOS-write. It is also possible to declare a VOSpace to be public, or to use an existing access group from an observing project.
-   VOSpace owners can add and remove members from the access control group(s) using the [CADC Group Management Interface](http://www1.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/access/control/groups)
-   See [Access Control](Access Control "wikilink") for more details.

Security Certificates
---------------------

So that users do not have to re-authenticate constantly, the CADC VOSpace implementation uses security certificates that are valid for a fixed length of time. This is a convenience for interactive use, but is important for scripted applications where embedding a user\_id and password in a script would open a serious security hole. The user logs into a certificate server with their CADC user\_id and password and saves the certificate in a secure location on their disk. They can then transfer files to and from VOSpace without having to re-authenticate for the lifetime of the certificate. VOSpace uses [SSL X509](http://en.wikipedia.org/wiki/X.509) certificates.

Beware that anyone with access to your certificate also has access to the VOSpace and can store and retrieve files under your name, a significant security risk. Be sure to protect the certificate in a directory only you can read: Create a directory called .ssl in your home directory, readable only by you, e.g. \> mkdir \~/.ssl \> chmod 700 \~/.ssl

Get a certificate using one of the following methods:

-   **Web Interface**:

`Log in to `[[`http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl`](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl)](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl)`.`
`Enter the number of days you want the certificate to last in the box.`
`Click "Download certificate", saving the file as ~/.ssl/cadcproxy.pem.`

-   **Python tools**: run the command

`getCert`

### Permissions

Permissions apply to both the UI and client versions of VOSpace. VOSpace permissions are similar to UNIX ones:

A user has read permission on a file or directory if:

-   One of these conditions is met:
    -   The user is the owner of the VOSpace
    -   The file or directory is marked as public
    -   The user is the owner of the file or directory
    -   The user is a member of the group specified by attribute group-read on the file or directory.
    -   The user is a member of the group specified by attribute group-write on the file or directory.

-   And:
    -   The user has read permission on every directory above the target in the hierarchy.

A user has write permission on a file or directory if:

-   One of these conditions is met:
    -   The user is the owner of the VOSpace
    -   The user is the owner of the file or directory, or
    -   The user is a member of the group specified by attribute group-write on the file or directory.

-   And:
    -   The user has read permission on every directory above the target in the hierarchy.

A user has delete permission on a file or directory if:

-   The user has write permission on the file or directory and on every directory and file below in the hierarchy.

A user has move permission on a file or directory if:

-   The user has delete permission on the file or directory being moved, and
-   The user has write permission on the destination container. (If the destination container is a new container, then the user must have write permission on the parent directory of that container.)

By default, new nodes inherit the permissions of the parent container. You can change the permissions after the node is created, or upon creation of the node.

When moving a node, the ownership of the node and all sub-nodes are assigned to the user who performed the operation.

Useful links
------------

-   The [Quick Start VOSpace](Quick Start VOSpace "wikilink") guide gives the minimal knowledge to manage a VOSpace storage space.
-   The [CADC VOSpace website](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vospace/) contain information of use to software developers.
-   <Printable> (this page with all wiki sub-pages included).

Tips
----

-   Each VOSpace action (put/get/delete etc) takes about 2 seconds no matter how small the file involved. If you have a large number of small files, performance will be poor. If you want to distribute a group of small files consider tar-ing files together.
-   Using VOFS allows you to mount (as a user) your VOSpace on Linux or OS-X computers. Then all the standard unix tools can be used to copy files around. Beware that some popular tools like rsync are crafted to exploit properties of locally mounted disks but interact very badly with network services like VOSpace.
-   Once a file is in VOSpace it is very secure against deletion: the storage system will not loose your file but **you can delete the file if you choose to**. Currently, however, the putting of a file to VOSpace is only 99% reliable. For vital files, make sure that the transfer to VOSpace completed before deleting your local copy.
-   If your CANFAR job writes outputs to VO space only, it is essential that you make sure that this step does not fail, since \$TMPDIR is deleted (and all your files are lost) once the job finishes. Look at this [Python script](Python script "wikilink") for a way to ensure that files are properly written to VO space before exiting a CANFAR job.
-   Sharing data via a URL. If you have a file called FILNAME stored in your VOSpace in directory DIR and that file is **Public** then the URL to that file can be accessed anonymously and the URL has the form: <http://www.cadc.hia.nrc.gc.ca/data/pub/USERNAME/DIR/FILENAME>
-   All parts of the PATH must be PUBLIC, including your root node.

