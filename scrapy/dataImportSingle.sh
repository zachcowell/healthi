#!/bin/bash
LOGFILE="log"
DATAFILE="$(date +"%m%d%y")single.json"

echo "=================== $(date +"%m.%d.%y") Data Pull ===================" >> $LOGFILE
echo "[$(date)] Begin scraping Dept of Health website" >> $LOGFILE
scrapy crawl single -o $DATAFILE
echo "[$(date)] Scrape complete" >> $LOGFILE
echo "[$(date)] Purging existing database" >> $LOGFILE
mongo healthi preimport.js
echo "[$(date)] Importing data into datastore" >> $LOGFILE
mongoimport --file $DATAFILE -d healthi -c inspections
echo "[$(date)] Performing post import task" >> $LOGFILE
mongo healthi import.js
echo "[$(date)] Geocoding addresses" >> $LOGFILE
python geocoding.py
echo "[$(date)] Yelp business ID coding" >> $LOGFILE
mongoimport -d healthi -c yelptemp --type csv --file ../yelpcoding/yelp.csv --headerline
mongo healthi yelpcoding.js
echo "[$(date)] Post-import" >> $LOGFILE
mongo healthi postimport.js >> $LOGFILE
echo "[$(date)] Cleanup" >> $LOGFILE
rm -rf dump
mv $DATAFILE pastimports/
echo "[$(date)] Done!" >> $LOGFILE