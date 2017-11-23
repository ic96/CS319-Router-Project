import psycopg2
import googlemaps
import json

api_key = "AIzaSyBGgneGpOxeRSzKytQDSjQuz-owUnjk-Mc"
gmaps = googlemaps.Client(key=api_key)

get_sites = "SELECT site_recid, address1, city, postal_code from msp_site;"
call_api = ""

result = gmaps.geocode('77 Edgevalley close')

#data = json.loads(json.dumps(result))
#print(json.dumps(result, sort_keys = True))
print(result[0]["geometry"]["location"])

#try:
 #   conn = psycopg2.connect(dbname="postgres", user="postgres", password="")
  #  cur = conn.cursor()
    



