You can access the CANFAR configuration VM using only your browser using the Virtual Network Computing (VNC) framework.

In order to do this, follow these steps:

1.  Go to your [Running VMs page](http://www.canfar.phys.uvic.ca/processing/#html/_vm_list.html)
2.  Click on the link of the IP address
3.  Depending on your browser and operating system, you will be offered to open a Java Web Start application, or to download a file called "VNCSession.jnlp"
4.  If it already offers you to open it, skip this step. Otherwise, you can open the downloaded file with a Java Web Start program. On some Linux systems, the executable is often called "javaws". You might have to configure your browser to do it. Many configurations are possible, please search the internet for a solution for your specific browser and OS, adding "java web start" key words.
5.  Now click to run the application. You might be offered to accept a certificate which you need to accept
6.  You should be asked for "Your private key authentication". This unclear message is the ssh passphrase you entered on the canfar login host. Then accept the standard ssh unknown host message "Are you sure you want to continue connecting" by clicking "yes"
7.  Then you will be asked a "VNC authentication password": either choose one if it is the first time on this session, or enter the same one as you entered initially for this session.

### VNC configuration for MAC OSX Mavericks

-   Copy your private key on the CANFAR login host to your desktop:

<!-- -->

     YOUdesktop$ scp YOU@canfar.dao.nrc.ca:.ssh/id_rsa* .
     YOUdesktop$ mv id_rsa .ssh/id_rsa
     YOUdesktop$ mv id_rsa.pub .ssh/id_rsa.pub
     YOUdesktop$ chmod 600 .ssh/id_rsa
     YOUdesktop$ ssh-copy-id -i .ssh/id_rsa YOU@canfar.dao.nrc.ca

-   Generally the ssh-copy-id agent is not installed on Mavericks. The easiest way to obtain it is through [MacPorts](http://www.macports.org/). Then:

<!-- -->

    sudo port install openssh +ssh_copy_id

-   You have the command installed on /opt/local/bin/ssh-copy-id. Just create a symbolic link to that:

<!-- -->

    sudo ln -s /opt/local/bin/ssh-copy-id /usr/bin/ssh-copy-id

-   Now your .ssh/config on your desktop should have:

<!-- -->

    Host canfar
       User YOU
       Hostname canfar.dao.nrc.ca
       ForwardX11 yes
       ForwardX11Trusted yes
       ForwardAgent yes

    Host 172.22.128.*
      User YOU
      ForwardX11 yes
      ForwardX11Trusted yes
      IdentityFile ~/.ssh/id_rsa_canfar
      ProxyCommand ssh canfar -W %h:%p

-   Click on the VM IP address on the Running VM webpage to get the VNCSession.jnlp file to be open with the Java Web Start application. If everything works well you will be asked to enter your CANFAR password and then to generate a VNC password.
-   In this way, however, the VNC is pretty slow and the graphic interface is quite ugly... Alternatively, you can ssh-tunnel the VNC doing:

<!-- -->

    ssh -N -L 8888:172.22.128.*:5901 YOU@canfar.dao.nrc.ca

-   Then point the safari browser to:

<!-- -->

    vnc://localhost:8888

-   Answer “yes” when the host is indicated and then you will be asked to enter the VNC password you generated at the previous step.
-   Enjoy your VNC!

