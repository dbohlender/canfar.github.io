The prototype configuration system is being superseded by the Nimbus Configuration system, which is easier to use, more powerful and more reliable. We recommend using the Nimbus Configuration system. In the long run, the prototype will be phased out.

However at this point in time, the Nimbus Configuration system has one flaw: The VM image file has to be stored in a public location. In principle, someone could download your VM image, boot it, and have access to whatever your VM has access to (any passwords, ssh keys etc, your are stored on your VM). The likelihood of this is low, but it does represent a potential security flaw.

The default location for storing your VM image is your VOspace. If the VM image is to public, all the directories above it must be public, so at the very least, the top-level directory of your VOspace has to be public. Depending on how you manage your privacy, this may be an issue for you.

Development is underway to remove the requirement the VM image be publically accessible. When that happens, we will be phasing out the prototype, and migrating those currently using it to the Nimbus configuration system. Until then, we recommend the Nimbus system, but want to make sure you are aware of the implications.
