Access Control
--------------

-   Only an administrator (VOSpace owner, observing project PI or survey coordinator) can add new members to an access group.
-   New members should [request a CADC account](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/auth/register.html) if they do not already have one.
-   Prospective members need to send their user\_id with a request to be added to the membership to the administrator.

### Adding New members to a VOSpace Access Group

VOSpace uses the [Group Management Service (GMS)](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/access/control/groups), for which help is available at [Group Management Help](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/access/control/help). For archival data, access control is provided through the older [Access Control](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/accessControl/) interface. The system as implemented makes easy and fairly obvious the steps needed to restrict access to particular parts of a VOSpace (directories or files) for particular groups of people, either reducing the number of people who can access the resource or limiting them to read-only access. A common request, however, is to extend the group of users who can access the whole VOSpace. This is easy, but slightly obscure with the current web interface. Following the steps below should do the job.

First, the easy part, common to every change in the access groups:

1.  Log in to your VOSpace
2.  Click the link in the lower left panel labelled "Manage Groups"
3.  On the "Manage Groups" page, create a group with a descriptive name like "writeAccess<YourVOSpace>" (the actual name must be unique, but is not intrinsically important)
4.  Add new members to the group who will be given have write access to the VOSpace
5.  Close the "Manage Groups" page

Now comes the part that is subtle, but still not hard. At the top of the VOSpace display there is a bar containing a set of icons, e.g.:
![](VOSicons.jpg "image")<span title=></span>

-   circular arrow for refresh
-   3-arc icon for "subscribe to RSS feed" (in case you want notification of changes, useful in a project VOSpace)
-   black triangle to navigate back one level in the VOSpace directory tree
-   folder icon to jump to a particular root folder
-   the name of the current VOSpace

What you want to do is to go back one level in the directory tree, not to a "root folder" but to the actual root "/", then edit the permissions on your root folder to add the new group of members for write access.

1.  Click on the black triangle, to go back to the root "/" and display all the VOSpaces to which you have access
2.  Click on the folder icon (NOT THE NAME!!!) for your VOSpace
3.  In the lower right of that panel, click on "Edit Permissions"
4.  You should see your name as the only item in the top panel, since you own the VOSpace
5.  Click "Add Group"
6.  Select your new group from the pick list, which includes every group in the system to which you have access; your new group is probably near the bottom of the list
7.  Select the type of access to be "Read and write"
8.  Click the "Add" button.

Subsequently, you can at your leisure add new groups or change the membership of existing groups. With this same mechanism you can change the permissions on any directory or file in the VOSpace.

### Adding New Members to an Existing Data Access Group

The following brief tutorial illustrates how the older Access Control interface can be used to add members. This is useful when an existing data access group has been used to control access to a project VOSpace.

-   For the administrator, adding a new member is easy and quick through one of the interfaces:
    -   JCMT Science Archive: on the [JSA web page](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/jcmt/), under "Related Links" choose ["Edit Proprietary Access Control"](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/accessControl?archive=JCMT).
    -   VOSpace: on the [VOSpace web UI](http://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/vosui), choose *Manage Groups* from the menu on the left.

\* Scan down the list of groups you can manage to find the access control group you want to edit.

-   Click on the flapping page icon in the left column to edit the group members.

![](EditGroupMembers.jpg "image")

-   At the bottom of the page in the box labelled "Update Group Membership", enter the new user\_id and click the button "Add Member".

![](AddMember.jpg "image")

-   And that is all. Total time required, less than one minute.

\* To remove a member from the group, select their name from the pick list labelled "Group Members" and click "Delete Member".

-   For JCMT data access groups, note that members of the original observing proposal are impossible to remove permanently and will be added back to the group automatically each day.

### Setting VOSpace Access Control to an Existing Group

This operation can only be done in practice by a CADC operator who will be able to determine the "name" of the appropriate group, which is often numerical. Changing the access group for an existing space is extremely dangerous and should only be done immediately after the VOSpace has been created. This example uses the Java client.

`java -jar ~/lib/canfar/cadcVOSClient.jar --cert='.ssl/cadcproxy.pem' --set \`
`    --target='vos://`**`authority`**`~vospace/`**`vospace_name`**`' \`
`    --group-write='ivo://`**`authority`**`/gms#`**`access_group_name`**`'`

where

-   **authority** is cadc.nrc.ca for the CADC VOSpace
-   **vospace\_name** is the name of the VOSpace
-   **access\_group\_name** is the "name" of the access group, often an ASCII representation of the group\_id.

Almost all of the arguments need to be protected in single quotes because the punctuation characters are misinterpretted by the command line.
