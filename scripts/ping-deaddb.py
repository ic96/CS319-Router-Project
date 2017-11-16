import psycopg2
import subprocess
import re
import datetime
import os

get_device_data = "SELECT device_recid, ip_address FROM msp_device;"
insert_data_capture_cache = """
    INSERT INTO msp_data_capture
    (device_recid, latency_milliseconds, responded, date_recorded)
    VALUES ({0}, {1}, {2}, '{3}');
    """
insert_data_capture = """
    INSERT INTO msp_data_capture
    (device_recid, latency_milliseconds, responded)
    VALUES ({0}, {1}, {2});
    """


def ping_host(host, device_recid):
    
    notempty = os.stat("dbcache.txt").st_size !=0
    if notempty:
        read_cache_file()
    
    print('Pinging {0}'.format(host));
    p = subprocess.Popen(['ping', '-c', '5', host], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()

    # Handle dead ip
    if err:
        print(err)
        responded = False
        latency = -1
        cur.execute(insert_data_capture.format(device_recid, latency, responded))
    else:
        matcher = re.compile("round-trip min/avg/max/stddev = (\d+.\d+)/(\d+.\d+)/(\d+.\d+)/(\d+.\d+)")
        res = matcher.search(out).groups()
        responded = False
        latency = None
        if res:
            print('Avg latency for {0} = {1} ms'.format(host, res[1]))
            responded = True
            latency = res[1]
            cur.execute(insert_data_capture.format(device_recid, latency, responded))



# Use this ping function if database connetion fails and write ping results to a text file
def ping_host_down(host, device_recid):

    file = open("dbcache.txt", "a")
    print('Pinging {0}'.format(host));
    p = subprocess.Popen(['ping', '-c', '5', host], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()
    print("code reach here")
    
    # Handle dead ip
    if err:
        print(err)
        print("ping invalid ip")
        responded = False
        latency = -1
        file.write('{0},{1},{2}\n'.format(device_recid, latency, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")))
    else:
        matcher = re.compile("round-trip min/avg/max/stddev = (\d+.\d+)/(\d+.\d+)/(\d+.\d+)/(\d+.\d+)")
        res = matcher.search(out).groups()
        responded = False
        latency = None
        if res:
            print('Avg latency for {0} = {1} ms'.format(host, res[1]))
            responded = True
            latency = res[1]
            file.write('{0},{1},{2}\n'.format(device_recid, latency, datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")))


# Read data from cache file and insert data back to database
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
    conn = psycopg2.connect(dbname="postgrest", user="postgres", password="")
    cur = conn.cursor()
    cur.execute(get_device_data)
    devices = []
    
    # get all devices
    for res in cur:
        devices.append(res)

    # have to use a separate loop to not mess up the db cursor
    for device in devices:
        print(device)
        device_id, host = device;
        ping_host(host, device_id)


    conn.commit()
    cur.close()

except Exception as e:
    print(e)
    # ping devices from the device text file when db fails
    file = open("device.txt", "r")
    for line in file:
        currentline = line.split(",")
        device_recid = currentline[0]
        # strip the empty spaces that is attached to the host value at the end of the line
        host = currentline[1].strip()
        ping_host_down(host, device_recid)




finally:
    if conn is not None:
        conn.close()