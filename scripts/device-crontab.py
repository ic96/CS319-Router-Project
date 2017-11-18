import psycopg2



get_device_data = "SELECT device_recid, ip_address FROM msp_device;"


try:
    conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="ubc$5")
    cur = conn.cursor()
    cur.execute(get_device_data)
    devices = []

    file = open("device.txt", "w")
   # get all devices
    for res in cur:
        devices.append(res)

    # have to use a separate loop to not mess up the db cursor
    for device in devices:
        device_recid, host = device;
        file.write('{0},{1}\n'.format(device_recid,host))

    file.close()
 
    conn.commit()
    cur.close()
except Exception as e:
    print(e)
    

finally:
    if conn is not None:
        conn.close()