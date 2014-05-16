from __future__ import division
from pymongo import MongoClient
from bson.son import SON
from geopy.geocoders import GoogleV3
import csv,time,glob

class Geocoding(object):	
	def __init__(self):
		self.client = MongoClient('localhost', 27017)
		self.db = self.client.healthi
		self.inspections = self.db.inspections
		self.geolocator = GoogleV3()

	def geocode(self):
		unique_addresses_needing_geocode = self.get_unique_addresses_needing_geocode(self.inspections)
		unique_addresses = self.get_unique_addresses(self.inspections)
		unique_addresses_needing_geocode_count = len(unique_addresses_needing_geocode)
		unique_addresses_count = len(unique_addresses)
		percent = round(unique_addresses_needing_geocode_count / unique_addresses_count * 100,2)
		
		print "Number of addresses total: " + str(unique_addresses_count)
		print "Number of addresses needing geocoding: " + str(unique_addresses_needing_geocode_count) + " ("+str(percent)+ "%)" 
		
		data= [["address","city_state_zip","latitude","longitude"]]
		
		for inspection in unique_addresses_needing_geocode:
			item = self.get_google_lat_lng(inspection,self.geolocator)
			if item is not None:
				data.append(item)
		self.write_results_to_csv(data)

	def get_unique_addresses_needing_geocode(self,inspections):
		return inspections.aggregate([
				{ "$match" : { "lat": None } }, 
				{ "$group": {"_id": {"address": "$address","city_state_zip":"$city_state_zip"} }}
			])["result"]

	def get_unique_addresses(self,inspections):
		return inspections.aggregate([ 
				{ "$group": {"_id": {"address": "$address","city_state_zip":"$city_state_zip"} }}
			])["result"]

	def get_google_lat_lng(self,inspection,geolocator):
		idAddress= inspection["_id"]["address"]
		idCSZ = inspection["_id"]["city_state_zip"]
		addr= idAddress + ", " + idCSZ
		geoRes = geolocator.geocode(addr)
		if geoRes is not None: 
			address, (latitude, longitude) = geoRes
			print [idAddress,idCSZ,latitude,longitude]
			return [idAddress,idCSZ,latitude,longitude]

	def write_results_to_csv(self,data):
		path= time.strftime("geocoding/%m%d%Y.csv")
		with open(path, "wb") as csv_file:
			writer = csv.writer(csv_file,delimiter='|')
			for line in data:
				print line
				writer.writerow(line)

	def perform_lat_lng_inserts(self):
		all_CSVs= glob.glob("geocoding/*.csv")
		for some_csv in all_CSVs:
			with open(some_csv, 'rb') as f:
				reader = csv.reader(f,delimiter='|')
				self.read_results_from_csv(reader)

	def read_results_from_csv(self,reader):						
		rownum = 0
		for r in reader:
			rownum += 1
			if rownum > 0:
				self.update_address_with_lat_lng(r[0],r[1],r[2],r[3])

	def update_address_with_lat_lng(self,address,city_state_zip,lat,lng):
		self.inspections.update({"address":address,"city_state_zip": city_state_zip},{"$set":{"lat":lat,"lng":lng}},multi=True,upsert=True)

g = Geocoding()
g.perform_lat_lng_inserts()
#g.geocode()