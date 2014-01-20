#!/bin/bash

mongo healthi addressFind.js > out2.txt
tail -n +3 out2.txt > out.txt
rm out2.txt