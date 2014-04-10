This is the Quick Start guide to Processing. For more details see: [In Depth Processing](In Depth Processing "wikilink"). Log into the CANFAR submission host:

    ssh canfar.nrc.dao.ca

#### The Executable

Fire up your favorite editor and make a wrapper script <my_process.bash> that calls the executable on the VM. An example of the contents of that script is:

    #!/bin/bash
    source /home/<my_username>/.bashrc
    /home/<my_username>/<my_process> $@

Don't forget to set this file as executable:

    chmod +x <my_process.bash>

When you job executes on your VM your working directory will be an auto-created directory on /staging/ on the VM, something like /staging/dir\_1234. To ensure that you write files to the correct directory reference the file system using the \$TMPDIR variable. When accessing temporary storage space your script should only write files to \$TMPDIR. Do not assume you will know where your are in the FileSystem, just use the \$TMPDIR variable.

#### The Condor Submission file

Here is an example of a condor submission file:

#### Submiting and Monitoring your compute Job

Use condor to queue your job for processing:

    condor_submit <my_process.condor>

Monitor your jobs within the queue:

    condor_q

Check which VMs are booted and running:

    condor_status

Check your results and the exec files <my_process>.{log,err,out}.

Kill jobs:

    condor_rm <my_obnoxious_job>

#### Troubleshooting

See the trouble shooting guide in the in depth processing documentation: <In_Depth_Processing#Troubleshooting>

[Category:Quick Start Guide](Category:Quick Start Guide "wikilink")
