Conversion from wikimedia to markdown
-------------------------------------

* Download all your pages into a big xml files with
http://your_media_wiki/Special:Export or Special:AllPages
* Install perl module mediawiki dump (debian: libparse-mediawikidump-perl)
* Install pandoc
* Run:

   ./mediawiki2markdown.bash <xml_file>

