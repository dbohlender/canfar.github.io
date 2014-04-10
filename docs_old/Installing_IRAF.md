This document describes how to install IRAF and related STSCI software on a CANFAR standard Scientific Linux 5.x VM.

IRAF
----

After 25 years of IRAF existence, the IRAF maintainers did not find the time to use a decent [build automation tool](http://en.wikipedia.org/wiki/List_of_build_automation_software). Therefore no Linux distribution picked the package to make it easily installable, and there is no such thing as 'yum install iraf' or 'yum update iraf' (end of rant). So if you have a previous IRAF, just punt it:

    sudo rm -rf /iraf # or wherever it was installed

Then install the latest IRAF version (as of Sep 2011, 2.15.1a):

    sudo mkdir -p /iraf/iraf
    export iraf=/iraf/iraf/ (bash)
    setenv iraf /iraf/iraf/ (tcsh)
    cd $iraf
    curl ftp://iraf.noao.edu/iraf/v215/PCIX/iraf-linux.tar.gz | sudo tar xfz -
    sudo $iraf/unix/hlib/install

Follow the instructions on the terminal, default answer to everything will give you a standard IRAF installation.

For further details you can consult the IRAF [README](ftp://iraf.noao.edu/iraf/v215/PCIX/README) or read [this site](http://www.astr.tohoku.ac.jp/~akhlaghi/irafinstall.html).

X11IRAF
-------

You might need ximtool or xgterm for your VM, in which case follow these instructions below, adapting the version:

    sudo yum install libXmu ncurses
    sudo mkdir -p /iraf/x11iraf && cd /iraf/x11iraf
    curl http://iraf.noao.edu/x11iraf/x11iraf-v2.0BETA-bin.redhat.tar.gz | sudo tar xfz -
    sudo ./install

Default answer to everything should be fine.

Alternatives to X11IRAF is to use a standard xterm (sudo yum install xterm) and SAOIMAGE DS9, of which you will find instructions in [Astronomy Software](Astronomy Software "wikilink") section

PyRAF
-----

If you want PyRAF installed on your VM, you will need a few dependencies before getting started.

First, install STSDAS/TABLES. It only works on 32 bits (read an [explanation](http://www.stsci.edu/resources/software_hardware/stsdas/iraf64)), but the default VM support both 32 and 64 bits. So if you followed IRAF instructions above, do the following:

    sudo su -
    export IRAFARCH=linux iraf=/iraf/iraf/
    cd $iraf/extern
    ./configure
    make stsdas

Now the latest stsci\_python works on python 2.5 and above, and your VM has python 2.4 by default. Fortunately, python 2.6 can also be installed simultaneously, but only a handful of packages were packaged for python 2.6 on Scientific Linux 5.x. Assuming now you are logged in as root (the sudo su - above), install the easy dependencies

    yum install tkinter26 python26-numpy-devel xorg-x11-proto-devel

Then install the bad dependencies (the one you would have to maintain/update yourself): Pmw, urwid, ipython for python 2.6:

    cd /iraf
    curl -L  http://downloads.sourceforge.net/project/pmw/Pmw/Pmw.1.3.2/Pmw.1.3.2.tar.gz | tar xfz -
    cd Pmw.1.3.2/src
    python26 setup.py install
    cd /iraf
    curl http://excess.org/urwid/urwid-1.0.0.tar.gz | tar xfz -
    cd urwid-1.0.0
    python26 setup.py install
    cd /iraf
    curl http://archive.ipython.org/release/0.10.2/ipython-0.10.2.tar.gz | tar xfz -
    cd ipython-0.10.2
    python26 setup.py install
    cd /iraf
    curl http://stsdas.stsci.edu/download/stsci_python_2.12/stsci_python-2.12.tar.gz | tar xfz -
    cd stsci_python-2.12
    python26 setup.py install

From the last bit, check your installation:

    python26 testpk.py

You might get a warning about the numpy version. It should not matter, but if you see trouble, feel free to modify this section to install numpy-1.6.1.

One last tip is to have display when playing with iraf/ximtool/ds9:

    sudo yum install xauth

Then logout and login again to your VM using ssh -X or ssh -Y.
