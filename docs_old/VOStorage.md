This is the Quick Start guide to VOSpace. If you need more details, go to the [In Depth VOSpace](In Depth VOSpace "wikilink") documentation.

Getting VOSpace and using the web UI
------------------------------------

1.  If you haven't already, get a CADC account. Use this URL: [<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html)
2.  Get your VOSpace space set up. Send an e-mail to canfarhelp@nrc-cnrc.gc.ca with your space requirements, your user name and a very brief justification (1 or 2 sentences only. If we need more information we will contact you).
3.  Once you get a e-mail back saying that your space has been created, go to: [<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vosui/>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vosui/) You will need your username and password. Most operations are fairly obvious from this webpage. If you don't intend to use the VOspace client, you're done.

VOSpace Wrapper Scripts
-----------------------

Direct installation of the Java Client (below) can be a bit more complex. To make interaction on the command line and inside processing scripts more straight forward we offer these user-contributed wrapper scripts. They make the syntax somewhat simpler. You may also want to include the subroutines in these scripts in your own software. If you have a useful wrapper script, please help the community by making that script available here. Both these scripts download the Java Client and a certificate if necesary.

-   [Java client](Java client "wikilink") Installation and usage
-   [python wrapper and vofs](VOSpace_filesystem "wikilink") (J.J. Kavelaars)

Installing the Security Certificate
-----------------------------------

-   The JavaClient uses a security certificate for authentication, in stead of user/password combination. To use the client you will need to install a certificate. Create a directory called .ssl in your home directory, readable only by you:

<!-- -->

    mkdir ~/.ssl
    chmod 700 ~/.ssl

-   The VOSpace client allows you to do the same operations from the command line. You will need a certificate for this. Get one by going to:

[<http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl>](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cadcbin/auth/archive/accountDetails.pl). You will need your CADC username and password. On that website select the number of days and download the file cadcproxy.pem. Save that file in \~/.ssl/

[Category:Quick Start Guide](Category:Quick Start Guide "wikilink")
