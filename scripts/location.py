import psycog2

get_sites = "SELECT site_recid, address1, city, postal_code from msp_site;"
call_api = ""
api_key = "AIzaSyBGgneGpOxeRSzKytQDSjQuz-owUnjk-Mc"

try:
    conn = psycopg2.connect(dbname="postgres", user="postgres", password="")
    cur = conn.cursor()
    



