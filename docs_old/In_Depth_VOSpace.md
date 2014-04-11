Introduction to VOSpace
-----------------------

The VOSpace is the CANFAR storage system, an implementation of the [Virtual Observatory Specification](http://www.ivoa.net/Documents/VOSpace/). It is intended to be used for storing the output of the CANFAR processing system and also for sharing files among members of a collaboration. If the data you want to process is not already in a CADC archive, you can stage it there for further processing. Files in VOSpace are mirrored in two physical locations, so they are secure against disk failure.

There are two ways to interact with VOspace. The first is with your browser via the web user interface; this is easy to use, but interactive. To access VOSpace in scripts, a java client is available. Although the client is harder to use, wrapper scripts exist to make it almost as easy to use as the usual UNIX commands cp, ls, rm, chmod and mkdir.

There are few terms which may not be familiar to some users:

-   **nodes:** Nodes are equivalent to directories and files. A containerNode is a directory, a dataNode is a file.
-   **groups:** If you have proprietary data at CADC you should already be familiar with groups. A group is a list of CADC users who have access to data. When you are allocated your VOSpace, two groups are created: the read group and the write group. They will have names like: gmarx-VOS-read and gmarx-VOS-write.
-   **certificates:** These are way of authenticating without a user name and a password. They're like ssh keys except they expire. They allow you to transfer files to and from VOSpace without having to put your username and password in your scripts, which is a possible security hazard. VOSpace uses [SSL X509](http://en.wikipedia.org/wiki/X.509) certificates.

Before you start
----------------

If you haven't already, get a CADC account. Use this URL: [<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html)

Get your VOSpace userspace set up. Send an e-mail to <canfarhelp@nrc-cnrc.gc.ca> with your space requirements (how many Gb or Tb), your CADC user name and a very brief justification (1 or 2 sentences only. If need more information we will ask). Be realistic in your space requirements. If you later find that you need your quota increased, this can be done fairly easily.

Using the web user interface
----------------------------

The web user interface should be fairly easy to use. Once you get the e-mail saying your VOSpace has been created, point your browser at an URL like:

    http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vosui/#gmarx

(replace gmarx with your username).

To Upload a file, click on "Upload File". In the pop-up, click on "Browse". Navigate to the file you want to upload and click on it (this behavior is slightly browser dependent). Click upload. After a pause (expect about 2 seconds + 1 second per MB of file size) the screen will refresh and your file will be uploaded

To download one file, click on a link and save it like you would a normal link.

To download multiple files, tick off on the appropriate boxes on the leftmost column, or click on the top box to select all the files. Click on "Download". You will be redirected to CADC download manager. You can now use a Java client to download files simultaneously.

To delete files, tick off their boxes and click on "Delete".

To set permissions on files tick off their boxes and click on "Set Permissions". You will presented with a pop-up box with "Read Group", "Write Group" and "Public". Set the groups as appropriate (or leave them set to null). Set public if you want all users to be able view your data. (Note that public is not the same as anonymous. Visitors to your VOSpace will still need their CADC username and password even if a node is public. Setting something public just means that **all** CADC users can view a node.) Once you're happy with the permissions, click "Save".

To add or remove people from your groups, click on "Manage groups". You will presented with a list of groups. There should be at least two groups (VOS-read and VOS-write). If you have proprietary data at the CADC, there may be more groups. Click on the members icon. To delete members tick their boxes and click "Remove members". To add members, enter their CADC username.

Using the client
----------------

The client is a java program which allows scriptable access to VOSpace. It uses certificates to authenticate with the VOSpace server. To use it, you must first download the client software and get a certificate.

#### Installing the software

Download the java client from [here](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcVOS/software/cadcVOSClient.tar) and unpack it:

    tar -xvf cadcVOSClient.tar

this will create a directory call lib/ with a number of .jar files in it. These files should be put in a convenient location. In the examples that follow it is assumed that the files ended up in \~/lib, but they can be put anywhere you like. You will have to specify the full path for each VOSpace command, so try not to make to complicated. The .jar file you are most interested in is cadcVOSClient.jar but all the other .jar files in the tarball should be in the same directory.

Next make sure your version of java is 1.6 or higher. Type:

    java -version

If it is less than 1.6, update it yourself or get your sysadmin to update it for you.

#### Getting certificates

Before using the client you must get a certificate. Do this by going to: [<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl). Enter the number of days you want the certificate to last in the box and click "Download certificate". You can save the resulting file anywhere you like, but there are advantages to saving it as \~/.ssl/cadcproxy.pem. You don't have to do this manually. You can also use curl or wget to get the certificate:

    curl -u <userid>:<password> -o ~/.ssl/cadcproxy.pem http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cred/proxyCert?daysValid=<num days>
    wget --http-user=<userid> --http-password=<password> -O ~/.ssl/cadcproxy.pem http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cred/proxyCert?daysValid=<num days>

Where the <userid> and <password> are your CADC account userid/password. If you have a file in your home directory called .netrc and it contains lines like:

    machine www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca login gmarx password swordfish
    machine www1.cadc-ccda.hia-iha.nrc-cnrc.gc.ca login gmarx password swordfish
    machine www2.cadc-ccda.hia-iha.nrc-cnrc.gc.ca login gmarx password swordfish
    machine www3.cadc-ccda.hia-iha.nrc-cnrc.gc.ca login gmarx password swordfish
    machine www4.cadc-ccda.hia-iha.nrc-cnrc.gc.ca login gmarx password swordfish

then you can leave the userid and password off the command line. (Substitute gmarx and swordfish with your username and password)
#### Running the client

##### Certificate and client arguments

The syntax for the client is very verbose. The commands that follow are not really meant to be typed in at the command line.They are meant to be used in scripts. Wrapper scripts have been written which simplify the syntax considerable. However for full control in programs, you may be better off using the client directly.

All the commands start off with

    java -jar <full-path-to-client.jar> --cert=<full-path-to-certificate.pem>

For example if you have stored the client .jar files in \~/canfar/lib/ and stored your certificate in \~/canfar/cert/ the command would be:

    java -jar ~/canfar/lib/cadcVOSClient.jar --cert=~/canfar/cert/cadcproxy.pem

If you have stored your certificate in \~/.ssl/, you can leave out the `--cert` option.

    java -jar ~/canfar/lib/cadcVOSClient.jar 

##### Action arguments

**Copy: (= cp )**

    --copy --src=<source> --dest=<destination>

source and destination are either files on your local computer or nodes in VOSpace. If they are nodes in VOSpace, then they look like:

    vos://cadc.nrc.ca~vospace/gmarx/stars.fits

For now, you can only copy dataNodes, not container nodes. One of source and destination must be a local file, the other must be a VOSpace node. If you are copying a file to VOSpace you can also set permissions on the file. See "Set permissions" below. Examples:

    java -jar ~/canfar/lib/cadcVOSClient.jar --copy --src=oneliners.txt --dest=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt 
    java -jar ~/canfar/lib/cadcVOSClient.jar --copy --src=oneliners.txt --dest=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt --public=true
    java -jar ~/canfar/lib/cadcVOSClient.jar --copy --src=vos://cadc.nrc.ca~vospace/gmarx/jokes.txt --dest=jokes.txt

**Delete a node: (= rm)**

    --delete --target=<node>

where target is a VOSpace node. If you delete a containerNode, you also delete its contents (= rm -r). Be careful!

Example:

    java -jar ~/canfar/lib/cadcVOSClient.jar --delete --target=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt 

**Create a link to a node: (= ln)**

    --create=LinkNode --target=<node1> --link=<node2>

where node1 is the new node and node2 is an existing VOSpace node.

Example:

    java -jar ~/canfar/lib/cadcVOSClient.jar --create=LinkNode --target=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt --link=vos://cadc.nrc.ca~vospace/wcfields/zingers.asc

**View a node (= ls)**

    --view --target=<node>

This gives output telling you who created the node, when it was last modified, who has read/write access and the size. If the node is a containerNode, it will list all the nodes in it, with information on each node. If it is a dataNode, then you will also get the md5sum.

Examples:

    java -jar ~/canfar/lib/cadcVOSClient.jar --view --target=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt 
    java -jar ~/canfar/lib/cadcVOSClient.jar --view --target=vos://cadc.nrc.ca~vospace/gmarx/movies/

**Move a node (= mv)**

    --move --src=<source> --dest=<destination>

The move command allows you to move a data node or container node to another container node. If the destination container does not already exist, the source will be moved into the parent container of the destination and will be renamed to the name of the destination. You may also move files to/from VOSpace. These operations are executed as copy actions with a subsequent delete of the source.

Examples:

    java -jar ~/canfar/lib/cadcVOSClient.jar --move --src=vos://cadc.nrc.ca~vospace/marx/slapstick.txt --dest=vos://cadc.nrc.ca~vospace/marx/jokes
    java -jar ~/canfar/lib/cadcVOSClient.jar --move --src=vos://cadc.nrc.ca~vospace/marx/slapstick --dest=vos://cadc.nrc.ca~vospace/marx/jokes
    java -jar ~/canfar/lib/cadcVOSClient.jar --move --src=slapstick.txt --dest=vos://cadc.nrc.ca~vospace/marx
    java -jar ~/canfar/lib/cadcVOSClient.jar --move --src=vos://cadc.nrc.ca~vospace/marx/slapstick.txt --dest=slapstick.txt

**Create a container node: (= mkdir)**

    --create --target=<node>

Adding `--ip` will cause the permissions to inherited from the parent node. Examples:

    java -jar ~/canfar/lib/cadcVOSClient.jar --create --target=vos://cadc.nrc.ca~vospace/gmarx/jokes
    java -jar ~/canfar/lib/cadcVOSClient.jar --create --target=vos://cadc.nrc.ca~vospace/gmarx/jokes --ip

**Set permissions: (=\~chmod)**

use one of:

    --set --target=<node> --public=[true|false]
    --set --target=<node> --group-read=<group>
    --set --target=<node> --group-write=<group>

You can combine the permissions settings in one command if you like.

For example:

    java -jar ~/canfar/lib/cadcVOSClient.jar \
      --set --target=vos://cadc.nrc.ca~vospace/gmarx/oneliners.txt \
      --public=true --group-read=<marx_brothers> --group_write=<marx_brothers>

##### Wrapper scripts

User-contributed wrapper scripts have been written. They make the syntax somewhat simpler. You may also want to include the subroutines in these scripts in your own software. There two sets of scripts:

-   [perl wrapper scripts](perl wrapper scripts "wikilink") (written by S. Gwyn)
-   [Python VOSpace client](Python VOSpace client "wikilink") (written by J.J. Kavelaars)
-   [VOSpace filesystem](VOSpace filesystem "wikilink") (written by J.J. Kavelaars)

Permissions
-----------

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

Tips
----

-   Each VOSpace action (put/get/delete etc) takes about 2 seconds no matter how small the file involved. If you have a large number of small files, performance will be poor. If you want to distribute a group of small files consider tar-ing files together.
-   Using VOFS allows you to mount (as a user) your VOSpace on Linux or OS-X computers. Then all the standard unix tools can be used to copy files around.
-   Once a file is in VOSpace it is very secure against deletion: the storage system will not loose your file but **you can delete the file if you choose to**. Currently, however, the putting of a file to VOSpace is only 99% reliable. For vital files, make sure that the transfer to VOSpace completed before deleting your local copy.
-   If your CANFAR job writes outputs to VO space only, it is essential that you make sure that this step does not fail, since \$TMPDIR is deleted (and all your files are lost) once the job finishes. Look at this [Python script](Python script "wikilink") for a way to ensure that files are properly written to VO space before exiting a CANFAR job.
-   Sharing data via a URL. If you have a file called FILNAME stored in your VOSpace in directory DIR and that file is **Public** then the URL to that file can be accessed anonymously and the URL has the form: <http://www.cadc.hia.nrc.gc.ca/data/pub/vospace/USERNAME/DIR/FILENAME>
-   All parts of the PATH must be PUBLIC, including your root node. To make your root node public using the Java client follow the instructions listed in [\#Running the client](#Running_the_client "wikilink"). To make your root node public using the web interface:
    -   Display the root of your VOSpace
    -   Click on the ".." entry at the top of the list
    -   Click on the icon next to vospace
    -   Click on "Details"
    -   Use "Edit permissions" if necessary
    -   The page should say "Publicly Readable? Yes" when you're done


