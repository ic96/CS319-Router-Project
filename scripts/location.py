import psycopg2
import googlemaps
import json

api_key = "AIzaSyBGgneGpOxeRSzKytQDSjQuz-owUnjk-Mc"
gmaps = googlemaps.Client(key=api_key)

get_sites = "SELECT site_recid, address1, city, postal_code from msp_site;"

result = gmaps.geocode('77 Edgevalley Close T3A5E9')

#print(result[0]["geometry"]["location"]["lat"])
#print(result[0]["geometry"]["location"]["lng"])

try:
   conn = psycopg2.connect(dbname="ubc05", user="louis", password="123")
   cur = conn.cursor()
   cur.execute(get_sites)
   sites = cur.fetchall()
   
   for line in sites:
      print(line)
      site = line[0]
      address = line[1]
      postal = line[3]
      result = gmaps.geocode(address + ' ' + postal)
      if len(result) >= 1:
         latitude = result[0]["geometry"]["location"]["lat"]
         longitude = result[0]["geometry"]["location"]["lng"]
         print(result[0]["geometry"]["location"])
         update_query = "update msp_site SET (latitude,longitude) = ("+str(latitude)+","+str(longitude)+") where site_recid = " + str(site) + ";" 
         print (update_query)
         cur.execute(update_query)
      else:
        print(address+" Got No result")

   conn.close()
except Exception as e:
       print(e)
finally:
       if conn is not None:
                  conn.close()
   



