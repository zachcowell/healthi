#!/bin/bash
i=0
(mongo healthi addressFind.js) | while read line
do
	if [$i > 1] then
   		echo $line
   	fi
done

# add in bash script to parse the list and perform an http request to geocode each address