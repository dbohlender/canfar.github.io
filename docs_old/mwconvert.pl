#!/usr/bin/perl -w

use strict;
use Parse::MediaWikiDump;
 
my $xmlfile = shift(@ARGV) or die "usage: mwconvert.pl <xml file>";
my $xmlpage;
my $wikipages = Parse::MediaWikiDump::Pages->new($xmlfile);
 
while(defined($xmlpage = $wikipages->next)) { 
    print $xmlpage->title, "\n"; 
    my $content = $xmlpage->text; 
    open(my $fid, '>', $xmlpage->title);
    print $fid $$content;
    close $fid;
}
