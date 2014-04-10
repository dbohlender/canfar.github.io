The following is a list of some astronomy packages and the their install procedures. The idea is to show some examples, not to give exhaustive installation instructions of all astronomical software.

Autotools based software
------------------------

Fortunately, some astronomers use standard build system, which make it easy to install. As good examples, the following software use the GNU autoconf/automake tools:

-   [SExtractor](http://www.astromatic.net/software/sextractor/) and all the [AstrOmatic suite](http://www.astromatic.net/) (SWarp, SCAMP,...)
-   [WCSLIB](http://www.atnf.csiro.au/people/mcalabre/WCS/)
-   [CFITSIO](http://dev.gentoo.org/~bicatali/) (re-packaged version that includes imcopy and funpack)
-   [WCSTOOLS](http://dev.gentoo.org/~bicatali/) (re-packaged version)

In this case, the recipe is simple: 1) Go to the page linked above and copy the link of the latest version 2) Login to your VM, then

    wget <paste the package latest version link here>
    tar xf <package tar ball>
    cd <package directory>
    ./configure
    make -j2
    sudo make install
    make clean 

SAOIMAGE DS9
------------

ds9 is visualization software for astronomical images. It is packaged as a binary blob and bundles a whole lot of system libraries horribly. The installation could have been easy if it was properly statically linked but it is not. So you will need various X libraries, some fonts and XPA to talk from other programs such as Python or IRAF to DS9. Follow the following recipe to install it. Replace the 6.2 below with latest version on [home page](http://hea-www.harvard.edu/RD/ds9/).

    sudo yum install libXScrnSaver libXrandr libXft dejavu-lgc-fonts xauth xpa
    cd /usr/local/bin
    curl 'http://hea-www.harvard.edu/saord/download/ds9/linux64/ds9.linux64.7.1.tar.gz' | sudo tar xfz -

Perl WCStools
-------------

    wget http://search.cpan.org/CPAN/authors/id/P/PR/PRATZLAFF/Astro-WCS-LibWCS-0.91.tar.gz | tar xfz -
    cd Astro-WCS-LibWCS-0.91
    export WCSTOOLS=$PWD/wcstools-3.8.1/ #(or wherever the WCStools directory from the last one ended up)
    perl Makefile.PL
    make
    make test
    sudo make install 

IRAF/PyRAF
----------

See full details at: [Installing IRAF](Installing IRAF "wikilink").

ds9/pyds9
---------

If you want the absolutely latest version, you will have download it from Harvard e.g.:

`wget `[`http://hea-www.harvard.edu/saord/download/ds9/linux64/ds9.linux64.7.1.tar.gz`](http://hea-www.harvard.edu/saord/download/ds9/linux64/ds9.linux64.7.1.tar.gz)
`tar -xvf ds9.linux64.7.1.tar.gz`
`sudo cp ds9 /usr/local/bin/`
`sudo yum install libXScrnSaver`

If you do not want the latest ds9 (version 7.1 as Nov 2012), you can use 'yum' which will get version 5.2:

`sudo yum install ds9 `
 `Then, get the xpa stuff from the source... the yum doesn't work.`

`curl '`[`http://hea-www.harvard.edu/saord/download/xpa/xpa-2.1.13.tar.gz`](http://hea-www.harvard.edu/saord/download/xpa/xpa-2.1.13.tar.gz)`' | tar zxf - `
`cd xpa-2.1.13`
`./configure`
`make`
`sudo make install`

If you want to use the python package 'pyds9' to send xpa messages to ds9 from inside a script, then you need to get the pyds9 package <http://hea-www.harvard.edu/saord/ds9/>. But to build pyds9 you will need x11. The following should be sufficient:

`sudo yum install libXt-devel.x86_64`

xvista
------

Try this. No guarantees. Also, some might of the yums might be superfluous.

    sudo yum install xterm xauth
    sudo yum install libX11-devel
    sudo yum groupinstall "Development Tools"
    sudo yum install rpmdevtools pkgconfig xorg-x11-proto-devel xorg-x11-xtrans-devel libxcb-devel libXau-devel libXdmcp-devel
    sudo yum install lynx

    wget 'http://ganymede.nmsu.edu/holtz/xvista/xvista7-12e.tar.gz'
    tar -xvf xvista7-12e.tar.gz
    cd xvista
    cd source
    ./configure
    cd ..
    make
    sudo make install

Notes:

For some reason xvista needs the source files to exist at run time. Don't delete or move them.

To run files in the batch mode (in a kludgey way) set the environment variable BATCH to 'true', then put all the commands in an ascii file, then pipe the contents of the file into xvista. There's probably a better way.

[2](Category:VMConfiguration "wikilink") [1](Category:Software "wikilink")
