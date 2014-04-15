---
layout: docs
title: VM Access
permalink: /docs/vmaccess/
---

Access to the canfar hosts is limited to SSH (Secure Shell). SSH is a key-based authentication mechanism. This requires set up on both your local machine, and any remote machines where you need either interactive or programmatic connections. SSH has a client-server architecture.

## SSH Desktop Setup

### Basic SSH configuration

On the canfar login host, you have probably created your ssh key with either the `canfarsetup` command or with a `ssh-keygen` command. For easy access and for the VNC connections to work, you will need to copy the private key to your desktop.

{% highlight bash %}
scp USER@canfar.dao.nrc.ca:.ssh/id*sa* ~/.ssh/
chmod 600 ~/.ssh/id*sa
{% endhighlight %}

You actually don't need the private key on the canfar login host, this is slightly insecure but more convenient to have. However the CANFAR VMOD system needs the public key. Now to simplify your connections to CANFAR VM and login host, you can add the following lines to your desktop/laptop `.ssh/config` file:

{% highlight text %}
Host canfar
  Hostname canfar.dao.nrc.ca
  User USER

Host 172.22.128.*
  User USER
  ProxyCommand ssh canfar -W %h:%p
{% endhighlight %}

With these commands, you can connect to the canfar login host simply with `ssh canfar` command, and connect directly to the VM with `ssh VM IP` command.

### Advanced SSH configuration

For a more advanced setup, you can add these options to your `~/.ssh/config`. Add them to either each `Host` individually, or defining a `Host *` section that will apply for all.

- Allow X windows launched from your VM to appear:
{% highlight text %}
  ForwardX11 yes
  ForwardX11Trusted yes
{% endhighlight %}

- Use agent forwarding to avoid typing passphrases all the time:
{% highlight text %}
  ForwardAgent yes
{% endhighlight %}

- re-use existing ssh connections:
{% highlight text %}
  ControlMaster auto
  ControlPath ~/.ssh/control/%h-%l-%p
  ControlPersist 3600
{% endhighlight %}

  and create your directory for the sessions:

{% highlight basj %}
mkdir ~/.ssh/control
{% endhighlight %}

- If you need to have several private keys add:
{% highlight text %}
  IdentityFile /full/path/to/my/private/key
{% endhighlight %}

- If you are often losing connections, you could add:
{% highlight text %}
  ServerAliveInterval 30
{% endhighlight %}

## Command-line connection to a VM

You can access the CANFAR configuration VM by simply follow the basic setup above, and from your desktop:

{% highlight bash %}
ssh VM_IP
{% endhighlight %}

Or without any desktop setup; connecting to the canfar login host, then the VM:

{% highlight bash %}
# enter CADC username/password
ssh USER@canfar.dao.nrc.ca
# enter passphrase that you generated
ssh VM_IP
{% endhighlight %}

If you want to connect to a running job that you launched with condor, for a sufficiently recent VM, you can directly connect your VM wherever it is running from the canfar login host: 

{% highlight bash %}
condor_ssh_to_job JOB_ID
{% endhighlight %}

## Graphical (VNC) connection to a VM

### Using the CANFAR web interface

You can access the CANFAR configuration VM using only your browser using the Virtual Network Computing (VNC) protocol. The CANFAR web interface offers a VNC client. You will need to use the same ssh keys on your desktop and on the canfar login host. Follow these steps to use the CANFAR web interface VNC client:

1. Go to your [Running VMs page](http://www.canfar.phys.uvic.ca/processing/#html/_vm_list.html)
2. Click on the link of the IP address
3. Depending on your browser and operating system, you will be offered to open a Java Web Start application, or to download a file called `VNCSession.jnlp`
4. If it already offers you to open it, skip this step. Otherwise, you can open the downloaded file with a Java Web Start program. On some Linux systems, the executable is often called `javaws`. You might want to configure your browser to do it automatically. Many configurations are possible, please search the internet for a solution for your specific browser and OS, looking "java web start" key words for example. 
5. Now click to run the application. You might have to accept a certificate which you need to accept.
6. You should be asked for "Your private key authentication". This unclear message is the ssh passphrase you entered on the canfar login host. Then accept the standard ssh unknown host message "Are you sure you want to continue connecting" by clicking "yes"
7.  Then you will be asked a "VNC authentication password": either choose one if it is the first time on this session, or enter the same one as you entered initially for this session.

### Other possible VNC connections

You might have a more pleasant experience using other VNC clients, such as more native to your operating system. One way to do it is to use ssh tunnelling. 

- For the ssh server, set `canfar.dao.nrc.ca`, with your CADC user name
- For the VNC server set to `VM_IP:5901`
- You will need to start the VNC server on your VM, by either using the CANFAR web VNC graphical client mentioned above, or running this command: 

{% highlight bash %}
ssh VM_IP vncserver
{% endhighlight %}

Now you need a VNC client on your desktop. Here are some examples of known to be good VNC clients for Linux and OSX:

#### Linux

- Your can install [Remmina](http://remmina.sourceforge.net/), then launch it
- From Reminna, click **Create a new profile**  on the interface, then:

	**Basic** -> **Server**: VM_IP:5901
	**Basic** -> **Username**: USER
	**SSH** -> **Enable SSH tunnel**: yes
	**SSH** -> **SSH Server** -> **Custom** -> **Server**: canfar.dao.nrc.ca
	**SSH** -> **SSH Authentification** -> **Public Key(automatic)** : yes

#### Mac OS-X

- Create an ssh tunnel (assumes the ssh configuration above):

{% highlight bash %}
ssh -f -N -L 5902:VM_IP:5901 canfar
{% endhighlight %}

- Launch safari and point your it to: [vnc://localhost:5902](vnc://localhost:5902)
- Once you're done, kill your ssh tunnel (find the process id, then kill)
