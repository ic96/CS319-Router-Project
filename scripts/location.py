import psycog2

command = "SELECT * from msp_site;"

try:
    conn = psycopg2.connect(dbname="postgres", user="postgres", password="")
    cur = conn.cursor()
    



