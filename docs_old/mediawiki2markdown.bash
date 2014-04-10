#!/bin/bash

mkdir markdown
cd markdown
perl mwconvert.pl ../$1
find . -type f -exec pandoc  -f mediawiki -t markdown_github -o "{}".md "{}" \;

