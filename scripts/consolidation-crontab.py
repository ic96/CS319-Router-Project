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
    WHERE (current_timestamp at time zone 'UTC')-date_recorded > (interval '30 day');
"""

def average_records(records, target_table, n, last_records):
    accumulated_latency = 0
    row_count = 0
    no_respond = 0
    current_device_recid = 0
    last_end_id = 0
    current_end_id = 0
    is_first_iter = True
    
    i = 0
    while (i < len(records)):
        #print(record)
        record = records[i]
        record_id, device_recid, latency, responded, date, age = record
        
        if (age >= 30):
            if (is_first_iter):
                accumulated_latency = 0
                row_count = 0
                no_respond = 0
                if (last_records.has_key(device_recid)):
                    last_end_id = last_records[device_recid]
                else:
                    last_end_id = 0
                current_end_id = last_end_id
                current_device_recid = device_recid
                is_first_iter = False
            
            if (last_end_id < record_id):
                if (current_device_recid == device_recid):
                    if (responded):
                        accumulated_latency += latency
                    else:
                        no_respond += 1
                    
                    row_count += 1
                else:
                    last_records[current_device_recid] = current_end_id
                    row_count = 0
                    i -= 1
                    is_first_iter = True
                
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
                    current_end_id = record_id
                
        i += 1

try:
    conn = psycopg2.connect(dbname="ubc05", user="ubc05", password="UbC$5")
    cur = conn.cursor()
    
    last_consolidation_lv1 = {}
    last_consolidation_lv2 = {}
    
    # Determine where the consolidation left off since last time
    try:
        file = open("consolidation-record.txt", "r")
        for line in file:
            rec = line.split(',')
            if(len(rec) == 3):
                if (rec[0] == 'level1'):
                    last_consolidation_lv1[int(rec[1])] = rec[2].rstrip()
                else:
                    last_consolidation_lv2[int(rec[1])] = rec[2].rstrip()
        file.close()
    except Exception:
        print("No record of previous consolidation found.")
        print("Creating ...")
        open("consolidation-record.txt", 'w').close()
    
    # Get and average all per-minute records
    records = []
    cur.execute(get_record.format('msp_data_capture'))
    for res in cur:
        records.append(res)
    average_records(records, 'msp_data_capture_level2', 5, last_consolidation_lv1)
    conn.commit()
        
    # Get and average all 5-minute records
    records = []
    cur.execute(get_record.format('msp_data_capture_level2'))
    for res in cur:
        records.append(res)
    average_records(records, 'msp_data_capture_level3', 5, last_consolidation_lv2)
    conn.commit()
    
    # Update record lv1
    #print(last_consolidation_lv1)
    open("consolidation-record.txt", 'w').close()
    file = open("consolidation-record.txt", "a")
    for recid in last_consolidation_lv1.keys():
        file.write("level1,{0},{1}\n".format(recid, last_consolidation_lv1[recid]))
    
    # Update record lv2
    #print(last_consolidation_lv2)
    for recid in last_consolidation_lv2.keys():
        file.write("level2,{0},{1}\n".format(recid, last_consolidation_lv2[recid]))
    
    file.close()
    
    # Clear > 90 days
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