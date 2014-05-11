from __future__ import division
from pymongo import MongoClient
from bson.son import SON

class Geocoding(object):
	
	def geocode(self):
		client = MongoClient('localhost', 27017)
		db = client.healthi
		inspections = db.inspections
		unique_addresses_needing_geocode = inspections.aggregate([
				{ "$match" : { "lat": None } }, 
				{ "$group": {"_id": {"address": "$address","city_state_zip":"$city_state_zip"} }}
			])["result"]
		unique_addresses_needing_geocode_count = len(unique_addresses_needing_geocode)
		unique_addresses = inspections.aggregate([ 
				{ "$group": {"_id": {"address": "$address","city_state_zip":"$city_state_zip"} }}
			])["result"]
		unique_addresses_count = len(unique_addresses)
		
		percent = round(unique_addresses_needing_geocode_count / unique_addresses_count * 100,2)
		
		print "Number of addresses total: " + str(unique_addresses_count)
		print "Number of addresses needing geocoding: " + str(unique_addresses_needing_geocode_count) + " ("+str(percent)+ "%)" 
		
		for inspection in unique_addresses:
			self.get_google_lat_lng(inspection)



	def get_google_lat_lng(self,inspection):
		print('')


g = Geocoding()
g.geocode()