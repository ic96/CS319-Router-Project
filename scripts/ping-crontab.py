import psycopg2
import subprocess
import re
import datetime
import os

get_device_data = "SELECT device_recid, ip_address FROM msp_device;"
insert_data_capture = """
    INSERT INTO msp_data_capture
    (device_recid, latency_milliseconds, responded)
    VALUES ({0}, {1}, {2});
"""
insert_data_capture_cache = """
    INSERT INTO msp_data_capture
    (device_recid, latency_milliseconds, responded, date_recorded)
    VALUES ({0}, {1}, {2}, '{3}');
"""


def ping_host(host, device_id, is_db_down):
  
    file = None
    if (not is_db_down):
        notempty = os.stat("dbcache.txt").st_size !=0
        if notempty:
            read_cache_file()
    else:
        file = open("dbcache.txt", "a")
        
    print('Pinging {0}'.format(host));
    p = subprocess.Popen(['ping', '-c', '1', host], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()
    
    # Log raw ping results
    # file.write(out)
    
    if err:
        #print(err)
        file.write('[ERROR] device_recid={0}, host={1}\n, date_time={2}'.format(device_id, host, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S (UTC)")))
    else:
        matcher = re.compile("rtt min/avg/max/mdev = (\d+.\d+)/(\d+.\d+)/(\d+.\d+)/(\d+.\d+)")
        responded = False
        latency = -1
        try:
            res = matcher.search(out).groups()
            if res:
                #print('Latency for {0} = {1} ms'.format(host, res[1]))
                responded = True
                latency = res[1]
                if (not is_db_down):
                    cur.execute(insert_data_capture.format(device_id, latency, responded))
                else:
                    file.write('{0},{1},{2}\n'.format(device_recid, latency, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")))
                #file.write('[SUCCESS] device_recid={0}, host={1}, latency={2}, date_time={3}\n'.format(device_id, host, latency, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S (UTC)")))
        except Exception as e:
            #print('No return for {0}'.format(host))
            if (not is_db_down):
                cur.execute(insert_data_capture.format(device_id, latency, responded))
            else:
                file.write('{0},{1},{2}\n'.format(device_recid, latency, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")))
            #file.write('[FAILURE] device_recid={0}, host={1}, date_time={2}\n'.format(device_id, host, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S (UTC)")))

def read_cache_file():
    file = open("dbcache.txt", "r")
    for line in file:
        currentline = line.split(",")
        device_recid = currentline[0]
        latency = currentline[1]
        # strip the empty spaces that is attached to the date value at the end of the line
        date = currentline[2].strip()
        if latency == "-1":
            responded = False
        else:
            responded = True
        cur.execute(insert_data_capture_cache.format(device_recid, latency, responded, date))

    conn.commit()
    # clear the content in the cache file after data is inserted to db
    open('dbcache.txt', 'w').close()

try:
    conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
    cur = conn.cursor()
    cur.execute(get_device_data)
    devices = []
    # get all devices
    for res in cur:
        devices.append(res)

    # Initiate logging file
    file = open("ping_log.txt", "a")
    
    # have to use a separate loop to not mess up the db cursor
    for device in devices:
        print(device)
        device_id, host = device;
        ping_host(host, device_id, False)

    conn.commit()
    cur.close()
except Exception as e:
    print(e)
    # ping devices from the device text file when db fails
    conn = None
    file = open("device.txt", "r")
    for line in file:
        currentline = line.split(",")
        device_recid = currentline[0]
        # strip the empty spaces that is attached to the host value at the end of the line
        host = currentline[1].strip()
        ping_host(host, device_recid, True)
finally:
    if conn is not None:
        conn.close()