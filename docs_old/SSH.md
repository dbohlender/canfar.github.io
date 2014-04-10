Introduction
------------

Access to the canfar hosts is limited to SSH (Secure Shell). SSH is a key-based authentication mechanism. This requires set up on both your local machine, and any remote machines where you need either interactive or programmatic connections. SSH has a client-server architecture. Almost all your SSH use should be covered by the client documentation at the following links.

Desktop Setup
-------------

On the canfar login host, you typically have created your ssh key with either the `canfarsetup` command or with a `ssh-keygen` command. For easy access and for the remote VNC to work, you will need to copy the private key to your desktop.

    scp YOU@canfar.dao.nrc.ca:.ssh/id*sa* ~/.ssh/
    chmod 600 ~/.ssh/id*sa

You actually don't need the private key on the canfar login host, this is slightly insecure but more convenient to have

You can add the following to your desktop/laptop .ssh/config file to simplify your canfar connections:

    Host canfar
      Hostname canfar.dao.nrc.ca
      User YOU

    Host 172.22.128.*
      User YOU
      ProxyCommand ssh canfar -W %h:%p

With these commands, you can connect to the canfar login host simply with `ssh canfar` command, and connect directly to the VM with `ssh <VM IP>` command. For a more advanced setup, you can add these options to either each Host individually, or defining a "Host \*" section that will apply for all Host:

-   allow X windows launched from your VM to appear, add:

<!-- -->

      ForwardX11 yes
      ForwardX11Trusted yes

-   use agent forwarding to avoid typing passphrases all the time:

<!-- -->

      ForwardAgent yes

-   re-use existing ssh connections, add:

<!-- -->

      ControlMaster auto
      ControlPath ~/.ssh/control/%h-%l-%p
      ControlPersist 3600

and create your directory for the sessions:

    mkdir .ssh/control

-   If you need to have several private keys add:

<!-- -->

      IdentityFile /full/path/to/my/private/key

-   If you are often losing connections, you could add:

<!-- -->

       ServerAliveInterval 30

[Category:Quick Start Guide](Category:Quick Start Guide "wikilink")
