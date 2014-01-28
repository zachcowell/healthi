#!/bin/bash
i=0
(mongo healthi addressFind.js | tail +3) | while read line
do
   	echo $line
done

# add in bash script to parse the list and perform an http request to geocode each address