This is an example of a Python script that will keep trying to write a file to VO space until it succeeds. The script uses JJ Kavelaars' [Python VOSpace client](Python VOSpace client "wikilink"). If the results of your CANFAR job are *only* written to VO space, you might want to add something similar to the code below to your script. Fields enclosed in "\<\>" are specific to each user.

    #!/usr/bin/python
    import os,sys
    import vos
    writedir = str(os.getenv('TMPDIR','/staging')+'/')
    c = vos.Client()
    os.system('wget  --http-user=<user> --http-password=<passwd> -O ~/.ssl/cadcproxy.pem "http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cred/proxyCert?daysValid=2"')
    gotit = False
    ntries=1
    while os.stat(writedir+"<your file>").st_size != c.copy(writedir+"<your file>","vos:<your VO space path>/<your file>"):
          ntries++
          print "Trying again (%d)" % ( ntries)
          if ntries > 1000:
                break
    sys.exit()
