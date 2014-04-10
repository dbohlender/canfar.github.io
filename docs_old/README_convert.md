Conversion from wikimedia to markdown
-------------------------------------

To convert:
1. Download all your pages into a big xml files with http://your_media_wiki/Special:Export or Special:AllPages
2. Install perl module mediawiki dump (debian: libparse-mediawikidump-perl)
3. Install pandoc
4. Run:
   
   ./mediawiki2markdown.bash <xml_file>    

