This page lists packages requested from our current CANFAR users. We are trying to easily maintain these packages on the long term. The CANFAR VM is based on [Scientific Linux 6](http://www.scientificlinux.org/) (a clone of Redhat Enterprise Linux 6), so the current solution is to maintain all packages with [YUM](http://docs.redhat.com/docs/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/ch-yum.html) repositories.

The table below gathers all requested software from the CANFAR users. Many of them need to be translated into the RPM format (spec file) to be understood by YUM. They will end up in a separate CANFAR YUM repository. Watch this space as packages are being added, removed and translated.

Explanation of the table:

-   The link (column 1) points to the homepage of the package, from where the upstream latest version (column 2) was retrieved
-   The latest RPM version (column 3) of the package in a given YUM repository (column 4) available to the Scientific Linux 6.x is shown
-   Color coding:
    -   <span style="color:green">GOOD</span>: an acceptable version for users is available in the repository
    -   <span style="color:orange">OK</span>: not available in any repository, but binary package available
    -   <span style="color:red">BAD</span>: needs more work

-   [Link](http://scientificlinuxforum.org/index.php?showtopic=266) of possible repositories to check for RPM
-   [Link](http://gpo.zugaina.org/) to search a package on the Gentoo repositories

|Package Name|Last Version|YUM Version (repo)|Gentoo Version (overlay)|Comment|
|------------|------------|------------------|------------------------|-------|
|[ALLPHOT](https://github.com/sfabbro/allphot)|0.8.1|<span style="color:red">none</span>|<span style="color:green">0.8.1</span> (local)||
|[astrometry.net](http://astrometry.net/)|0.38|<span style="color:red">none</span>|<span style="color:green">0.38</span> (sci)|is the web service sufficient?|
|ALLFRAME|4|<span style="color:red">none</span>|<span style="color:green">4.1.1</span> (local)|needs Peter Stetson agreement|
|[Astropysics](http://packages.python.org/Astropysics/)|0.1.dev-r1161|<span style="color:red">none</span>|<span style="color:green">live</span> (sci)||
|[Boost](http://www.boost.org/)|1.49|<span style="color:orange">1.41</span>|<span style="color:green">1.49</span>||
|[BPZ](http://www.its.caltech.edu/~coe/BPZ/)|1.99.3|<span style="color:red">none</span>|<span style="color:green">1.99.3</span> (sci)||
|[CASA](http://casa.nrao.edu/)|3.3.0|<span style="color:orange">3.3.0</span>|<span style="color:orange">3.3.0</span>|RPM on homepage / Gentoo only casacore|
|[cfitsio](http://heasarc.gsfc.nasa.gov/fitsio/)|3.300|<span style="color:orange">3.240</span> (epel)|<span style="color:green">3.290</span>|[package](http://astrowww.phys.uvic.ca/~seb/) with imcopy|
|[CMake](http://www.cmake.org/)|2.8.8|<span style="color:orange">2.6.4</span>|<span style="color:green">2.8.8</span>||
|[DS9](http://canfar.phys.uvic.ca/wiki/index.php/Astronomy_Software)|6.2|<span style="color:orange">5.7</span> (epel)|<span style="color:green">6.2</span>||
|[EAZY](http://www.astro.yale.edu/eazy/)|1.00|<span style="color:red">none</span>|<span style="color:green">1.00</span> (sci)||
|[EyE](http://www.astromatic.net/software/eye)|1.4.1|<span style="color:orange">1.4.1</span> (rpm)|<span style="color:green">1.4.1</span> (sci)|RPM on homepage|
|[g77](http://gcc.gnu.org/)|3.4.6|<span style="color:green">3.4.6</span>|<span style="color:green">3.4.6</span>||
|[gfortran](http://gcc.gnu.org/)|4.7.0|<span style="color:orange">4.4.6</span>|<span style="color:green">4.6.3</span>||
|[FFTW](http://fftw.org/)|3.3.1|<span style="color:orange">3.2.2</span>|<span style="color:green">3.3.1</span>||
|[galfit](http://www.csua.berkeley.edu/~cyp/work/galfit/galfit.html)|3.0.4|<span style="color:red">none</span>|<span style="color:green">3.0.4</span> (sci)||
|[GDL](http://gnudatalanguage.sf.net/)|0.9.2|<span style="color:green">0.9.2</span>|<span style="color:green">0.9.2</span>||
|[GSL](http://www.gnu.org/gsl)|1.15|<span style="color:orange">1.13</span>|<span style="color:green">1.15</span>||
|[gnuplot](http://www.gnuplot.info/)|4.6.0|<span style="color:orange">4.2.6</span>|<span style="color:green">4.6.0</span>||
|[HEASOFT](http://heasarc.nasa.gov/lheasoft/)|6.12|<span style="color:red">none</span>|<span style="color:orange">6.12</span> (kork)|unverified package on gentoo|
|[IDL](http://www.exelisvis.com/language/en-us/productsservices/idl.aspx)|8|<span style="color:red">none</span>|<span style="color:red">none</span>|costly, will not do it - see GDL above|
|[ifort](http://software.intel.com/en-us/articles/intel-compilers/)|2011.9|<span style="color:orange">2011.9</span>|<span style="color:orange">2011.9</span> (sci)|needs registration. problematic [license](http://software.intel.com/en-us/articles/non-commercial-software-development/)?|
|[IDLAstro](http://idlastro.gsfc.nasa.gov/)|02 May 2012|<span style="color:red">none</span>|<span style="color:green">20120502</span>|no versioning (use date)|
|[imcat](http://www.ifa.hawaii.edu/~kaiser/imcat/)|NA|<span style="color:red">none</span>|<span style="color:red">none</span>|needs Nick Kaiser agreement|
|[IPython](http://ipython.org/)|0.12.1|<span style="color:orange">0.10.2</span> (epel)|<span style="color:green">0.12.1</span>||
|[IRAF](http://iraf.noao.edu/)|2.16|<span style="color:red">none</span>|<span style="color:red">none</span>|see <Installing_IRAF>|
|[Lapack++](http://lapackpp.sf.net/)|2.5.4|<span style="color:red">none</span>|<span style="color:green">2.5.4</span>||
|[ldactools](http://marvinweb.astro.uni-bonn.de/data_products/THELIWWW/)|1.2.0|<span style="color:red">none</span>|<span style="color:red">none</span>|could not find homepage - see THELI|
|[LePhare](http://www.cfht.hawaii.edu/~arnouts/LEPHARE/lephare.html)|2.2|<span style="color:red">none</span>|<span style="color:green">2.2</span> (sci)||
|[Matplotlib](http://matplotlib.sf.net/)|1.1.0|<span style="color:orange">0.99</span>|<span style="color:green">1.1.0</span>||
|[MissFITS](http://www.astromatic.net/software/missfits)|2.4.0|<span style="color:orange">2.4.0</span> (rpm)|<span style="color:green">2.4.0</span> (sci)|RPM on homepage|
|[Numpy](http://www.scipy.org/)|1.6.1|<span style="color:orange">1.3.1</span>|<span style="color:green">1.6.1</span>||
|[<http://acts.nersc.gov/opt>++/ Opt++]|2.4|<span style="color:red">none</span>|<span style="color:green">2.4</span> (sci)|needs registration|
|[poloka](http://astrowww.phys.uvic.ca/~seb/poloka)|0.8.1|<span style="color:red">none</span>|<span style="color:green">0.8.1</span> (local)||
|[PSFex](http://www.astromatic.net/software/psfex)|3.9.1|<span style="color:orange">3.9.1</span> (rpm)|<span style="color:green">3.9.1</span>|RPM on homepage|
|[PyEphem](http://rhodesmill.org/pyephem/)|3.7.5.1|<span style="color:orange">3.7.3.4</span> (epel)|<span style="color:green">3.7.5.1</span>||
|[PyFITS](http://www.stsci.edu/institute/software_hardware/pyfits)|3.0.7|<span style="color:orange">2.3.1</span> (epel)|<span style="color:green">3.0.7</span>||
|[PyRAF](http://www.stsci.edu/institute/software_hardware/pyraf)|1.11|<span style="color:red">none</span>|<span style="color:red">none</span>|see <Installing_IRAF>|
|[R](http://www.r-project.org/)|2.15.0|<span style="color:orange">2.14.1</span> (epel)|<span style="color:green">2.15.0</span>||
|[ROOT](http://root.cern.ch/drupal/)|5.32.03|<span style="color:orange">5.28.00h</span> (epel)|<span style="color:green">5.32.03</span>|latest RPM also on homepage|
|[SCAMP](http://www.astromatic.net/software/scamp/)|1.7|<span style="color:orange">1.7</span> (rpm)|<span style="color:green">1.7</span>|RPM on homepage|
|[ScientificPython](http://dirac.cnrs-orleans.fr/plone/software/scientificpython/)|2.9.1|<span style="color:red">none</span>|<span style="color:green">2.9.1</span>||
|[SciPy](http://www.scipy.org/)|0.10.1|<span style="color:orange">0.7.2</span> (epel)|<span style="color:green">0.10.1</span>||
|[SExtractor](http://www.astromatic.net/software/sextractor)|2.8.6|<span style="color:green">2.8.6</span> (epel)|<span style="color:green">2.8.6</span>|RPM also on homepage|
|[SkyMaker](http://www.astromatic.net/software/skymaker)|3.3.3|<span style="color:orange">3.3.3</span> (rpm)|<span style="color:green">3.3.3</span> (sci)|RPM on homepage|
|[SM](http://www.astro.princeton.edu/~rhl/sm/)|2.4.1|<span style="color:red">none</span>|<span style="color:red">none</span>|costly license, will not do it|
|[StarLink](http://starlink.jach.hawaii.edu/starlink)|kaulia|<span style="color:red">none</span>|<span style="color:green">kaulia</span> (sci)|binary available (with bundled system libraries)|
|[STIFF](http://www.astromatic.net/software/stiff)|2.1|<span style="color:orange">2.1</span> (rpm)|<span style="color:green">2.1</span>|RPM on homepage|
|[STILTS](http://www.star.bris.ac.uk/~mbt/stilts/)|2.4|<span style="color:red">none</span>|<span style="color:green">2.4</span> (sci)||
|[STSDAS](http://www.stsci.edu/institute/software_hardware/stsdas)|3.14|<span style="color:red">none</span>|<span style="color:red">none</span>|see <Installing_IRAF>|
|[Stuff](http://www.astromatic.net/software/stuff)|1.19|<span style="color:orange">1.19</span> (rpm)|<span style="color:green">1.19</span> (sci)|RPM on homepage|
|[SWarp](http://www.astromatic.net/software/swarp)|2.19.1|<span style="color:orange">2.17.6</span> (epel)|<span style="color:green">2.19.1</span>|latest RPM also on homepage|
|[THELI](http://marvinweb.astro.uni-bonn.de/data_products/THELIWWW/)|1.6.1|<span style="color:red">none</span>|<span style="color:red">none</span>||
|[topcat](http://www.star.bris.ac.uk/~mbt/topcat/)|3.9|<span style="color:red">none</span>|<span style="color:green">3.9</span> (sci)||
|[wcslib](http://www.atnf.csiro.au/people/mcalabre/WCS/)|4.13.4|<span style="color:orange">4.3.1</span> (epel)|<span style="color:green">4.13.4</span>||
|[wcstools](http://tdc-www.harvard.edu/wcstools/)|3.8.4|<span style="color:green">3.8.1</span> (epel)|<span style="color:green">3.8.4</span>||
|[Weka](http://www.cs.waikato.ac.nz/ml/weka/)|3.6.6|<span style="color:red">none</span>|<span style="color:green">3.6.6</span>||
|[WeightWatcher](http://www.astromatic.net/software/weightwatcher)|1.8.10|<span style="color:orange">1.8.10</span> (rpm)|<span style="color:green">1.8.10</span>|RPM on homepage|
|[ZEBRA](http://www.astro.phys.ethz.ch/exgal_ocosm/zebra/index.html)|1.01|<span style="color:red">none</span>|<span style="color:green">1.01</span> (sci)||
|[ZPEG](http://imacdlb.iap.fr:8080/cgi-bin/zpeg/zpeg.pl)|5.22|<span style="color:red">none</span>|<span style="color:red">none</span>|[download](ftp://ftp.iap.fr/pub/from_users/leborgne/zpeg/)|
||

<Category:VMConfiguration> <Category:Software>
