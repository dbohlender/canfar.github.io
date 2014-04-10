Reference

Port number for the VNC Server is 5901

Log in to the canfar configuration host:

    ssh canfar.dao.nrc.ca

Create a VM named myvm. The VM name you use here is also referred to as the 'VMType'.

    vmcreate <vmname>

<vmname> is the name of your VM. It should only contain the characters: a-zA-z\_0-1. An email containing information about your VM will be sent to you. Wait for this email, then ssh to your VM with the IP in the email. You can check the IPs of your running VMs by listing the running ones:

    vmlist

You should see something like:

    IP Address        VM Type        URL
    172.22.128.1      myvm       http://gimli2/vmrepo/minimal_SL55_3G.img
    172.22.128.10     myvm2      https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/data/pub/vospace/canfar/vmrepo/minimal_SL55_3G.img

    ssh 172.22.128.1 (or whatever the IP was)

There is also a very simple wrapper to connect your VM:

    vmssh myvm

You have sudo access by default. Install the VNC Server to run on the VM. By default, it will start whenever the VM is booted.

    sudo yum install vnc-server

And press 'y', then 'Enter' when prompted. Any required dependencies will be installed along with the VNC Server. The VNC server software will then install.

Now that you have the VNC Server installed you will also need some X11 software to run. By default VNC server will try to run the twm, xsetroot and xterm. To install those use yum again:

    sudo yum install xsetroot xterm twm

Again, respond 'y' to question about installing the dependencies

After it is completed, you can run

    vncserver --help

    usage: vncserver [:<number>] [-nohttpd] [-name <desktop-name>] [-depth <depth>]
                     [-geometry <width>x<height>]
                     [-pixelformat rgbNNN|bgrNNN]
                     <Xvnc-options>...

           vncserver -kill <X-display>

to see the available options. The geometry is one of the most useful options. The VNC Server can be started by running

    vncserver -geometry 800x600

For a window of 800 pixels wide by 600 pixels high.

You will be prompted to enter a password. This password can be anything, but you must remember it as any client connecting to this VM for a VNC session will be required to enter this password. After verifying the password, the VNC Server will be started on the default screen on port 5901, and the configuration will be saved in your \$HOME/.vnc directory on the VM.

You can test the basic connectivity from the VM by typing

    telnet localhost 5901

Which should output

    Trying 127.0.0.1...
    Connected to localhost.

The press ctrl-c three times to exit. The VNC Server has been successfully installed.

Exit from the vm.

Now, on the CANFAR Host, try the same telnet test with the VM's IP.

    telnet 172.22.128.1 5901

If you see the following error

    telnet: connect to address 172.22.128.1: No route to host
    telnet: Unable to connect to remote host: No route to host

Then the VM's firewall is blocking access to the VM for the VNC port. To open the port, log back on to the VM.

    ssh 172.22.128.1

Or

    vmssh myvm

Now we need a firewall rule to allow incoming connections. Enter this command. (Just cut and paste the lines below into a bash (not csh) shell.)

    sudo sed '/-A RH-Firewall-1-INPUT -j REJECT /i\
    -A RH-Firewall-1-INPUT -m state --state NEW -p tcp --dport 5901 -s 0.0.0.0/0 -j ACCEPT

    ' /etc/sysconfig/iptables > /tmp/iptables.tmp ; sudo mv /tmp/iptables.tmp /etc/sysconfig/iptables

**Note, the blank lines are necessary.** What this does is add a line (the one with ACCEPT in it) to the file /etc/sysconfig/iptables before the line with the REJECT in it. Also, this command will only run under bash. tcsh users will have to (temporarily) switch to bash.

If it was successful, there will be no output. Execute

    sudo /sbin/service iptables restart

to commit the new rule.

Exit from the VM. On the CANFAR Host, try the telnet command again.

    telnet 172.22.128.1 5901

Which should output

    Trying 127.0.0.1...
    Connected to localhost.

The Xvnc system is now setup.

To connect to your VNC server from your local desktop you will need to establish an ssh tunnel. Using an SSH tunnel ensures that your communication with the remote machine is encrypted and gets around firewall issues.

From your local desktop do:

    ssh -L 55901:172.22.128.1:5901 username@canfar.dao.nrc.ca 

be sure to substitute the IP address above for the IP address of your running VM (use vmlist on canfar login host). Then, on your desktop machine, connect your VNC viewer to localhost and port 55901. The VNC viewer depends on your operating system, it can be called "vncviewer" or vinagre on Linux.

Issues
------

If the VNC Server is not running on the Virtual Machine, the VNC client (Java Web Start software), will appear to 'freeze' or simply not do anything. This is a known issue and the only work around is the kill it, or make sure the VNC Server is running properly.

