This page describes the installation of the VOSpace python client. This client provides a 'Filesystem' view of VOSpace as well as command line tools (vcp, vls, vrm, vmkdir). The command line tools provide a light-weight mode for accessing your VOSpace files and are installed with the Python vos module, which also provides the mountvofs command. See the Installation Steps.

**Warning for CLOUD users:** environment settings of your VM login are NOT initiated by CONDOR when executing jobs on the CLOUD! Therefor you must set the PYTHONPATH variable on the CANFAR login host in the .bashrc on the login host. Or, at the start of your submission script add a line like:

    source ${HOME}/.bashrc

Certificates
------------

**NEW NEW NEW**

You must have a valid proxy certificate to use these packages. The tools no longer pull certificates for you. There is a convenient routine (getCert) supplied with this package to aid retrieving certificates.

If your certificate expires your commands (vls, vcp, ...) will stop working and mounts made with mountvofs will stop working. Just pull a new certificate and you should be all set.

VOSpace Command line tools
--------------------------

Try the following commands, substituting your CADC VOSpace in for <VOSpace> (most CANFAR users have VOSpace that is the same name as their CADC UserID. There are also project VOSpaces, eg the *NewHorizons* VOSpace):

`vls vos:`<VOSpace>`  [lists the contents to the root directory of VOSpace]`
`vcp ${HOME}/.bash vos:`<VOSpace>`  [copies your .bash file to the root node of VOSpace]`
`vrm vos:`<VOSpace>`/.bash [removes the .bash file, which you just copied to VOSpace, from the VOSpace]`
`vmv vos:`<VOSpace>`/fred vos:`<VOSpace>`/george [changes the name of file fred]`
`vmv vos:`<VOSpace>`/fred vos:`<VOSpace>`/names/ [moves file fred into directory names/]`
`vmkdir vos:`<VOSpace>`/newNode [makes a new node in your VOSpace]`

details on these can be found via eg.

    vls --help

and if you want to see whats going on try

    vls -v vos:<VOSpace>

The commands *vls*, *vcp*, *vrm*, *vmkdir* are all built from the python classes inside *vos.py* which is installed following the procedure above. pydoc vos to see how to use this client in your own scripts.

VOSpace FileSystem
------------------

One can also implement access to VOSpace as a filesystem layer. This technique uses the 'FUSE' package as a layer between file-system actions (like 'cp' and 'rm') and the VOSpace storage system. Using the **vofs** makes your VOSpace seem like a filesystem.

To use the vofs you will need to install python26, the FUSE libraries and the vofs python package. The vofs package includes a python fuse.py wrapper and script for passing fuse calls to the VOSpace web service. replace <USERNAME> in the steps below with your login name

'''At this time 'EMACS' will not work correctly with VOFS and using EMACS on a VOFS file will cause the file to be truncated. I'm working on a solution but haven't found one yet. This error is caused by EMACS using files like '\#junk.txt\#' as temporary filenames and '\#' is an illegal character in VOSpace filenames '''

To mount all available VOSpaces use the command:

`mountvofs`

now looking in /tmp/vospace you should see a listing of all available VOSpaces that you have read access in.

To mount a SPECIFIC vospace use commands like:

`mountvofs --vospace vos:VOSpaceName --mountpoint /root/mount/point/VOSpaceName`

the mountvofs command creates a cache directory where local copies of files from the VOSpace are kept, as needed. If the cached version is older than the copy on VOSpace then a new version is pulled. You can specify the size of the cache (default is 50 GBytes) and the location (default is \${HOME}/vos:VOSpace) on the command line. try:

`mountvofs --help`

for more details.

To unmount the VOSpace, use the following command:

`fusermount -u /root/mount/point/VOSpaceName   [LINUX]`
`umount /root/mount/point/VOSpaceName  [OS-X]`

Python Package Index
--------------------

Some details on installing this package are available from the PyPI site for vos: <http://pypi.python.org/pypi/vos/>

Installation steps (LINUX)
--------------------------

-   Install fuse [not required if you are only going to use the command line tools]

`sudo yum install fuse`
`sudo yum install fuse-devel`
`` sudo /usr/sbin/usermod -a  -G fuse `whoami` ``

Now you need to logout and log back in so that the group settings (needed to allow your account permission to run the fusemount program) are updated.

-   install python26 (or later)

`sudo yum install python26`
`sudo yum install python26-distribute`

-   install the vos package

`sudo easy_install-2.6 vos`

Installation Steps (OS-X)
-------------------------

To install on OS-X you will need to install [OSX-FUSE](http://osxfuse.github.com/) first (you will need to install this package in 'MacFUSE Compatibility' mode, there is a selection box for this during the install) and then follow the instructions for installing the mountvofs python package (see below). Requires python2.6 or newer.

` sudo easy_install vos`

Usage is the same as UNIX land instructions above but instead of 'fusermount -u' the command to un-mount is 'umount'. Also, the mounted FileSystem should appear as an icon on your desktop and you can use the Finder to look for files.

On some OS-X installations the mountvofs command will result in an error like 'libfuse.dylib' not found. Setting the environment variable DYLD\_FALLBACK\_LIBRARY\_PATH can help resolve this issue [Thanks Lauren].

`setenv DYLD_FALLBACK_LIBRARY_PATH /usr/local/lib/`

### Tips to Users

-   If your CANFAR job writes outputs to VO space only, it is essential that you make sure that this step does not fail, since \$TMPDIR is deleted (and all your files are lost) once the job finishes. Look at this [Python script](Python script "wikilink") for a way to ensure that files are properly written to VO space before exiting a CANFAR job.
-   If you do not have sudo privileges to run 'easy\_install' as above, you can install the vos tools in a separate location, such as your home directory, using the '--prefix' argument to easy\_install, e.g.:

` setenv PYTHONPATH $PYTHONPATH:${HOME}/lib/python2.6:${HOME}/lib/python2.6/site-packages`
` easy_install-2.6 --prefix $HOME vos`
