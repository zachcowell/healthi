#!/bin/bash

mongoimport --file data.json -d healthi -c inspections
mongo healthi import.js