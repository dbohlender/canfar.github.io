Sometime, often really, providing a user with your VM is a handy way of saving effort. At this time we don't have a direct way of sharing or copying VM's but we can limp our way through. Say user john wants to use mary's VM called astrovm, below is a possible list of actions for both john and mary to do in order to share the VM

-   john copies his public ssh key that is used on canfar. from canfar login host, he could do:

<!-- -->

    vcp ~/.ssh/id_rsa.pub vos:john

-   mary starts her VM:

<!-- -->

    vmstart astrovm

-   mary waits for the IP email, and connects to her VM:

<!-- -->

    vmssh astrovm

-   mary adds john as a user on her vm

<!-- -->

    sudo mkdir -p /etc/skel/.ssh
    sudo /usr/sbin/useradd -m -s /bin/bash john

-   mary logs in as john, and adds his ssh key it to his account:

<!-- -->

    sudo su - john
    vcp vos:john/id_rsa.pub id_rsa.pub.john
    cat id_rsa.pub.john >> ~john/.ssh/authorized_keys
    chown john:john ~john/.ssh/authorized_keys
    chmod 644 ~john/.ssh/authorized_keys

-   mary exits from john's aacount and saves her VM on her VOSpace:

<!-- -->

    sudo vmsave -t astrovm -v mary

-   mary waits for a confirmation email, and changes the permission of vmstore/astrovm.img.gz on her VOSpace for john to read it with the VOSpace web interface
-   john starts mary's VM:

<!-- -->

    vmstart --vospace mary astrovm

-   john does stuff on astrovm and saves it on mary's VOSpace:

<!-- -->

    vmstop --vospace mary astrovm

or he can save a modified copy on his VOSpace without the "--vospace mary" option

**NOTES**:

-   if software on the VM was not installed globally but on mary's directory, some environment variables might have to be set (PATH, LD\_LIBRARY\_PATH,...) so best practice is to install globally, such as in /usr/local

Old Stuff
---------

*The process to clone a VM involves a lot of latency....*'

1.  the VM owner should create you a new account on their VM, this VM should have the same name as your CANFAR user ID. Perhaps they will add this account name to the sudoers for that VM.
2.  the new user then sends the owner of the VM thier public ssh key, yes this is safe. The VM owner puts the key into the .ssh/authorized\_keys file of e new users account.
3.  shutdown the VM, this will. update the VM image.
4.  record the ID of this VM that you are going to share, we'll call this ID1
5.  The new user creates a new VM. This VM will be initiated, started and and ID number issued.
6.  write down the ID of this VM. We'll call this ID2
7.  ssh to the new VM and shutdown the VM (yes, right away).
8.  send the ID of your newly created VM and the ID of the VM you want to share to canfarhelp@astrosci.ca. Ask them to overwrite your new VM (ID2) with the shared VM (ID1).
9.  once CANFAR is done copying for you (you'll get an email) you can then start that VM using vcetool: start ID2
10. you should now login to the newly started copy of the VM you are sharing.

This is a COPY of the VM your friend has shared. If they update that VM and you want those updates, then you will need to repeat the copying of the master VM (ID1) onto the slave VM (ID2).

[Category:Quick Start Guide](Category:Quick Start Guide "wikilink")
