Perl wrapper scripts
--------------------

**These wrapper scripts are deprecated. Please move to the [python wrapper and vofs](VOSpace_filesystem "wikilink")** Wrapper scripts have been written in perl to improve the syntax of the commands.

You can download them from [<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/sgwyn/vos.tar>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/sgwyn/vos.tar). Unpack the tarball, cd to the created directory and run the installation script:

    wget -O vos.tar 'http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/sgwyn/vos.tar'
    tar -xvf vos.tar 
    cd vos
    perl install.pl

Then make sure the programs are somewhere in your path, either by moving the files, or changing your path.

install.pl also downloads the latest version of the Java client and installs it in the \~/canfar/ directory. If you ever need to update the Java client, run the command

    vupdate

You still need a certificate. The wrappers assume that you have a certificate called \~/.ssl/cadcproxy.pem. Each time you use one of the commands, it checks the age of the certificate. If the certifcate is more than 6 days old, it downloads a new one, valid for a week. (Alternatively, if you are an older CANFAR user, it assumes that you have made a proxy certificate called 1000day.crt and 1000day.key and that you have stored them either in the current directory, \~/.globus or \~/canfar.) If these things aren't true, you can change them with the -k option for each command. On the other hand, if they are the default name and location, you can just forget they exist until they expire.

I have replaced the part of the commands that looks like:

`vos://cadc.nrc.ca~vospace` with `v:` (or you can use `vos:`)

Which is long and always the same.

### vcp

    Usage:
      vcp [options] source destination
      vcp [options] source1 source2 .. destination
    Options: 
      -v: verbose
      -m: md5sum checks (retries up to 10 times)
      -d: dry run: does not actually perform the commands, just lists them
      -k: path to key root
      -h: this help

    Examples:

      Puts:
      vcp fred v:sgwyn/fred
      vcp fred v:sgwyn/george
      vcp fred* v:sgwyn/

      Gets:
      vcp v:sgwyn/fred .
      vcp v:sgwyn/fred* .
      vcp v:sgwyn/fred george

vcp can \*not\* copy from one VOSpace to another (yet). For example:

`vcp v:sgwyn/fred v:dwoods/fred`

won't work.

### vls


    Usage:
      vls [options] VOSpace path/
      vls [options] VOSpace path/pattern
    Options: 
      -v: verbose
      -k: path to key root
      -h: this help

    Examples:
      vls v:sgwyn/
      vls v:sgwyn/fred*

### vrm

    Usage: 
      vrm [options] VOSpace path/
      vrm [options] VOSpace path/pattern

    Use with caution! Remember who wrote this!

    Options: 
      -v: verbose
      -k: path to key root
      -d: dry run: does not actually perform the commands, just lists them
      -h: this help

    Examples:
      vrm v:sgwyn/fred
      vrm v:sgwyn/fred*

### vmkdir

    Usage:
      vkdir [options] <full path of directory to be created>
    Options: 
      -v: verbose
      -d: dry run: does not actually perform the commands, just lists them
      -k: path to key root
      -h: this help

    Examples:

      vmkdir v:sgwyn/karun

### vsetpub

    Usage:
      vsetpub [options] <VOSpace path>/file
      vsetpub [options] <VOSpace path>/<pattern>

    Options: 
      -v: verbose
      -k: path to key root
      -d: dry run: does not actually perform the commands, just lists them
      -p: set as private (without this option, files are set as public)
      -h: this help

    Examples:
      vsetpub v:sgwyn/fred
      vsetpub -p v:sgwyn/fred*

### vsetgrp

    Usage:
    To set the read group
      vsetgrp [options] -r <group> <VOSpace path>/file
      vsetgrp [options] -r <group> <VOSpace path>/<pattern>

    To set the write group
      vsetgrp [options] -r <group> <VOSpace path>/file
      vsetgrp [options] -r <group> <VOSpace path>/<pattern>


    Options: 
      -v: verbose
      -k: path to key root
      -d: dry run: does not actually perform the commands, just lists them
      -h: this help
      -r: read group
      -w: write group

    Examples:
      vsetgrp -r ngvs-VOS-read v:ngvs/fred
      vsetgrp -w ngvs-VOS-write NGVS-staff v:ngvs/*

### vsync

    Usage:
      vsync [options] <source directory> <destination directory>

      for now, you can only sync from VOspace a local disk

    Options: 
      -v: verbose
      -m: md5sum checks (retries up to 10 times)
      -1: check md5sum before copying. Skip if md5sums are identical
      -P: make files public 
      -d: dry run: does not actually perform the commands, just lists them
      -k: path to key root
      -T: time each transfer
      -D: print the date before each transfer
      -h: this help

    Examples:

      vsync v:sgwyn/fred/ .

### vupdate

This command updates to the latest version of the Java VOspace client. The client is installed in \~/canfar/

    Usage:

      vupdate

      (no options)

<Category:Software>
