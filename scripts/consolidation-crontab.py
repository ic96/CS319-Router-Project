import psycopg2
import datetime

get_record = """
    SELECT *, EXTRACT(DAY FROM(current_timestamp at time zone 'UTC')-date_recorded) AS record_age
    FROM {0}
    ORDER BY device_recid, id asc;
"""

insert_data_capture = """
    INSERT INTO {0}
    (device_recid, latency_milliseconds, responded)
    VALUES ({1}, {2}, {3});
"""

delete_over_30day = """
    DELETE FROM {0}
    WHERE EXTRACT(DAY FROM(current_timestamp at time zone 'UTC')-date_recorded) > 30;
"""

def average_records(records, target_table, n):
    accumulated_latency = 0
    row_count = 0
    no_respond = 0
    current_device_recid = 0    
    
    for record in records:
        #print(record)
        record_id, device_recid, latency, responded, date, age = record

        if (float(age) >= 30):
            if (current_device_recid == device_recid):
                if (responded):
                    accumulated_latency += latency
                else:
                    no_respond += 1
                
                row_count += 1
            else:
                current_device_recid = device_recid
                if (responded):
                    accumulated_latency = latency
                else:
                    no_respond = 1
                
                row_count = 1
            
            if (row_count == n):
                responded = False
                average_latency = -1
                
                if (no_respond < n):
                    average_latency = accumulated_latency / (n - no_respond)
                    responded = True
                            
                cur.execute(insert_data_capture.format(target_table, current_device_recid, average_latency, responded))
                accumulated_latency = 0
                row_count = 0
                no_respond = 0

try:
    conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
    cur = conn.cursor()
    
    # Get and average all per-minute records
    records = []
    cur.execute(get_record.format('msp_data_capture'))
    for res in cur:
        records.append(res)
    average_records(records, 'msp_data_capture_level2', 5)
    conn.commit()
        
    # Get and average all 5-minute records
    records = []
    cur.execute(get_record.format('msp_data_capture_level2'))
    for res in cur:
        records.append(res)
    average_records(records, 'msp_data_capture_level3', 5)
    conn.commit()
    
    # Clear > 30 days
    cur.execute(delete_over_30day.format('msp_data_capture'))
    cur.execute(delete_over_30day.format('msp_data_capture_level2'))
    cur.execute(delete_over_30day.format('msp_data_capture_level3'))
    conn.commit()
    
    cur.close()
except Exception as e:
    print(e)
finally:
    if conn is not None:
        conn.close()