import psycopg2
import subprocess
import re

get_device_data = "SELECT device_recid, ip_address FROM msp_device;"
insert_data_capture = """
    INSERT INTO msp_data_capture
    (device_recid, latency_milliseconds, responded)
    VALUES ({0}, {1}, {2});
"""

def ping_host(host, device_recid):
    print('Pinging {0}'.format(host));
    p = subprocess.Popen(['ping', '-c', '5', host], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = p.communicate()
    if err:
        print(err)
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

try:
    conn = psycopg2.connect(dbname="postgres", user="postgres", password="")
    cur = conn.cursor()
    cur.execute(get_device_data)
    devices = []
    # get all devices
    for res in cur:
        devices.append(res)

    # have to use a separate loop to not mess up the db cursor
    for device in devices:
        print(device)
        device_recid, host = device;
        ping_host(host, device_recid)

    conn.commit()
    cur.close()
except Exception as e:
    print(e)
finally:
    if conn is not None:
        conn.close()