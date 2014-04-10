Installing the java client
==========================

-   Download the java client:

[<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcVOS/software/cadcVOSClient.tar>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcVOS/software/cadcVOSClient.tar) Unpack it:

    tar -xvf cadcVOSClient.tar

this will create a directory called lib/ with a number of .jar files in it. These file should be put in a convenient location.

Using the client
================

-   Get a file: (= cp <vospace> <here>)
        java -jar cadcVOSClient.jar --copy --src=vos://cadc.nrc.ca~vospace/marx/slapstick.txt --dest=slapstick.txt

-   Put a file: (= cp <here> <vospace>)
        java -jar cadcVOSClient.jar --copy --src=slapstick.txt --dest=vos://cadc.nrc.ca~vospace/marx/slapstick.txt

-   Move a file: (= mv <vospace> <vospace>)
        java -jar cadcVOSClient.jar --move --src=vos://cadc.nrc.ca~vospace/marx/slapstick.txt --dest=vos://cadc.nrc.ca~vospace/marx/jokes

-   Move a directory: (= mv <vospace> <vospace>)
        java -jar cadcVOSClient.jar --move --src=vos://cadc.nrc.ca~vospace/marx/slapstick --dest=vos://cadc.nrc.ca~vospace/marx/jokes

-   Delete a file: (= rm)
         java -jar cadcVOSClient.jar --delete --target=vos://cadc.nrc.ca~vospace/marx/slapstick.txt

-   Create a directory: (= mkdir)
         java -jar cadcVOSClient.jar --create --target=vos://cadc.nrc.ca~vospace/marx/jokes 

-   View a directory (= ls)
         java -jar cadcVOSClient.jar --view --target=vos://cadc.nrc.ca~vospace/marx/jokes 

-   Make a file public (= chmod a+r)
         java -jar cadcVOSClient.jar --set --public=true --target=vos://cadc.nrc.ca~vospace/marx/slapstick.txt  

-   To allow members of a group to read and write a file (= chmod g+rw)

<!-- -->

    java -jar cadcVOSClient.jar --group-read=ivo://cadc.nrc.ca/gms#Marx_Brothers --target=vos://cadc.nrc.ca~vospace/marx/slapstick.txt 
    java -jar cadcVOSClient.jar --group-write=ivo://cadc.nrc.ca/gms#Marx_Brothers --target=vos://cadc.nrc.ca~vospace/marx/slapstick.txt 

All of these examples only work if the .jar files are in your current working directory. If they aren't, you must specify the full path to the files. For example, if the .jar files are in \~/canfar/lib, in order to view a directory you will need to write:

    java -jar ~/canfar/lib/cadcVOSClient.jar --view --target=vos://cadc.nrc.ca~vospace/marx/jokes
