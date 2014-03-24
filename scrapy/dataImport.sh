#!/bin/bash
LOGFILE="log"
DATAFILE="$(date +"%m%d%y").json"

echo "=================== $(date +"%m.%d.%y") Data Pull ===================" >> $LOGFILE
echo "[$(date)] Begin scraping Dept of Health website" >> $LOGFILE
scrapy crawl healthi -o $DATAFILE
echo "[$(date)] Scrape complete" >> $LOGFILE
echo "[$(date)] Purging existing database" >> $LOGFILE
mongo healthi preimport.js
echo "[$(date)] Importing data into datastore" >> $LOGFILE
mongoimport --file $DATAFILE -d healthi -c inspections
echo "[$(date)] Performing post import task" >> $LOGFILE
mongo healthi import.js
echo "[$(date)] Geocoding addresses" >> $LOGFILE
mongoimport --jsonArray --file ../geocoding/1391036161126.json -d healthi -c geotemp
mongoimport --jsonArray --file ../geocoding/1391046415342.json -d healthi -c geotemp
mongoimport --jsonArray --file ../geocoding/1391046983502.json -d healthi -c geotemp
mongoimport --jsonArray --file ../geocoding/1391094811139.json -d healthi -c geotemp
mongoimport --jsonArray --file ../geocoding/1391095425663.json -d healthi -c geotemp
mongo healthi geocoding.js
echo "[$(date)] Post-import" >> $LOGFILE
mongo healthi postimport.js >> $LOGFILE
echo "[$(date)] Dumping healthi database to file" >> $LOGFILE
mongodump --db healthi
echo "[$(date)] Pushing healthi to production" >> $LOGFILE
mongo --eval "db.inspections.drop()" -u rootu -p bravo ds027749.mongolab.com:27749/healthi
mongorestore -h ds027749.mongolab.com:27749 -d healthi -u rootu -p bravo dump/healthi
echo "[$(date)] Cleanup" >> $LOGFILE
rm -rf dump
mv $DATAFILE pastimports/
echo "[$(date)] Done!" >> $LOGFILE