Python tools
------------

Python tools can be download and installed as the [PyPI vos](http://pypi.python.org/pypi/vos/) package. Installation details for [Linux](#Linux "wikilink") and [Mac OS-X](#Mac_OS-X "wikilink") are given below. This is a stand-alone package that does not require the installation of the java client, although there are some seldom-used operations that have not been implemented in Python. Note that the [Perl wrapper scripts](Perl wrapper scripts "wikilink") have the same names as the Python commands, so users should install the Python or Perl tools but not both.

The Python tools start with a "v", but otherwise look and act like their Linux counterparts. Try the following commands, substituting your CADC VOSpace in for <VOSpace>. (Most CANFAR users have VOSpace that is the same name as their CADC UserID. There are also project VOSpaces, eg the *NewHorizons* VOSpace).

-   list the contents to the root directory of VOSpace:
        vls vos:<VOSpace>

-   copy your .bash file to the root node of VOSpace:
        vcp ${HOME}/.bash vos:<VOSpace>

-   remove the .bash file from your VOSpace:
        vrm vos:<VOSpace>/.bash

-   make a new node (subdirectory) in your VOSpace
        vmkdir vos:<VOSpace>/newNode

### Documentation

-   Documentation for this package is maintained on the PyPI site given above.
-   The "pydoc vos" command displays information on how to use this client in your own scripts.
-   Each command has its own help text, eg.
        vls --help

    .

-   Run the command in "verbose" mode with the "-v" switch to see what is going on, e.g.
        vls -v vos:<VOSpace>

    .

### VOSpace FileSystem

One can also implement access to VOSpace as a filesystem layer. This technique uses the 'FUSE' package as a layer between file-system actions (like 'cp' and 'rm') and the VOSpace storage system. Using the **vofs** makes your VOSpace seam like a filesystem.

To use the vofs you will need to install python26, the FUSE libraries and the vofs python package. The vofs package includes a python fuse.py wrapper and script for passing fuse calls to the VOSpace web service. replace <USERNAME> in the steps below with your login name

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

### Tips and Warnings

-   If your CANFAR job writes outputs to VO space only, it is essential that you make sure that this step does not fail, since \$TMPDIR is deleted (and all your files are lost) once the job finishes. Look at this [Python script](Python script "wikilink") for a way to ensure that files are properly written to VO space before exiting a CANFAR job.

-   '''At this time 'EMACS' will not work correctly with VOFS and using EMACS on a VOFS file will cause the file to be truncated. I'm working on a solution but haven't found one yet. This error is caused by EMACS using files like '\#junk.txt\#' as temporary filenames and '\#' is an illegal character in VOSpace filenames '''

### Installation Details

The Python tools are implemented in Python 2.6 and 2.7 and have not yet been ported to Python 3.

#### Linux

-   Install fuse [not required if you are only going to use the command line tools]

`sudo yum install fuse`
`sudo yum install fuse-devel`
`` sudo /usr/sbin/usermod -a  -G fuse `whoami` ``

-   Install python26 (or 2.7)

`sudo yum install python26`
`sudo yum install python26-distribute`

-   Install the vos package

`sudo easy_install-2.6 vos`

### Mac OS-X

To install on OS-X you will need to install [OSX-FUSE](http://osxfuse.github.com/) first (you will need to install this package in 'MacFUSE Compatibility' mode, there is a selection box for this during the install) and then follow the instructions for installing the mountvofs python package (see below).

` sudo easy_install vos`

Usage is the same as UNIX land instructions above but instead of 'fusermount -u' the command to un-mount is 'umount'. Also, the mounted FileSystem should appear as an icon on your desktop and you can use the Finder to look for files.

On some OS-X installations the mountvofs command will result in an error like 'libfuse.dylib' not found. Setting the environment variable DYLD\_FALLBACK\_LIBRARY\_PATH can help resolve this issue [Thanks Lauren].

`setenv DYLD_FALLBACK_LIBRARY_PATH /usr/local/lib/`

<Category:Software>
