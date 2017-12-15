import 'react-table/react-table.css'
import React from "react";
import axios from 'axios';
import { render } from "react-dom";
import { makeData, Logo, Tips } from "../Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
    {
        Header: "Site Description",
        accessor: "site_description",
        // TODO: HANDLE ONCLICK THE SAME WAY HERE AS IN MAPVIEW
    },
    {
        Header: "Site Address 1",
        accessor: "site_address1",
    },
    {
        Header: "Site Address 2",
        accessor: "site_address2",
    },
    {
        Header: "Site Location",
        accessor: "site_city",
    },
    {
        Header: "Site Province",
        accessor: "site_province",
    },
    {
        Header: "Site Postal Code",
        accessor: "site_postal_code"
    },

    {
        Header: "Clients",
        accessor: "site_clients"
    }
];

const subColumns = [
    {
        columns: [
            {
                Header: "Name",
                accessor: "device_description"
            }
        ]
    },
    {
        columns: [
            {
                Header: "IP Address",
                accessor: "device_ip_address"
            }
        ]
    },
    {
        columns: [
            {
                Header: "Network Type",
                accessor: "device_type"
            }
        ]
    },
    {
        columns: [
            {
                Header: "Network Health",
                accessor: "isLastFiveSuccess",
                width: 150,
                getProps: (state, rowInfo, column, row) => {
                  if(rowInfo != null){
                    if (rowInfo.row['isLastFiveSuccess']) {
                      console.log(rowInfo.row['isLastFiveSuccess']);
                      return{
                        style: {
                          background: 'green',
                        }
                      }
                    }

                    return {
                      style: {
                        background: 'red',
                      }
                    }
                  }
                  return {};
                },
                filterMethod: (filter, row) =>{
                	console.log(filter.value);
                	console.log(row);
                }
            }
        ]
    }
];

export default class TableView extends React.Component {

  componentDidMount() {
        const { data} = this.props;
        if (data) {
            const recIdToDeviceMap = {};
            const promises = [];

            // basically here we get a bunch of queries for device data and wait for them all at once
            data.forEach(site => {
                const siteId = site.site_id;

                // add device id + site id to map and add query for device data
                site.site_devices.forEach((device, i) => {
                    const recId = device.device_recid;
                    recIdToDeviceMap[recId] = device;

                    // to work on development mode uncomment line 61 and comment line 62
                    //promises.push(axios.get(`http://0.0.0.0:8000/lastsuccesspings/${recId}/`));
                    promises.push(axios.get(`/lastsuccesspings/${recId}/`));

                });
            });

            Promise.all(promises).then(siteSuccessResults => {
                siteSuccessResults.forEach(result => {
                  //console.log(result);

                  recIdToDeviceMap[result.data.device_recid]["isLastFiveSuccess"] = result.data.isSuccess;
                  console.log(recIdToDeviceMap[result.data.device_recid]);
                });
            }, err => {
                console.log(err);
            })

        }
    }


  render() {
    const { data, onSiteSelected, onDeviceSelected} = this.props;
    //console.log(data);
    // Add site_client field to data
      {data.forEach(site =>{
       var clients = site.site_devices.length;
        site["site_clients"] = clients;
      })}

    return (
      <div>
        <ReactTable
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            onClick: (e, handleOriginal) => {
              console.log(column.Header);
              if(column.Header != null){
                onSiteSelected(data[rowInfo.index].site_devices);
              }

              // IMPORTANT! React-Table uses onClick internally to trigger
              // events like expanding SubComponents and pivots.
              // By default a custom 'onClick' handler will override this functionality.
              // If you want to fire the original onClick handler, call the
              // 'handleOriginal' function.
              if (handleOriginal) {
                handleOriginal()
              }
           }
          }
        }}
          data={data}
          columns={columns}
          defaultPageSize={data.length}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]).includes(filter.value.toLowerCase())}
          className="-striped -highlight"
          SubComponent={row => {
              const siteDevices = row.original.site_devices;
              //console.log(siteDevices);
              return (
                  <div style={{padding: "20px"}}>
                      <ReactTable
                      getTdProps={(state, rowInfo, column, instance) => {
                        return {
                          onClick: (e, handleOriginal) => {
                            //console.log(rowInfo.original);
                            if(column.Header != null){
                              onDeviceSelected(rowInfo.original.device_recid);
                            }

                            // IMPORTANT! React-Table uses onClick internally to trigger
                            // events like expanding SubComponents and pivots.
                            // By default a custom 'onClick' handler will override this functionality.
                            // If you want to fire the original onClick handler, call the
                            // 'handleOriginal' function.
                            if (handleOriginal) {
                              handleOriginal()
                            }
                         }
                        }
                      }}
                      data={siteDevices}
                      columns={subColumns}
                      defaultPageSize={siteDevices.length}
                      showPagination={false}
                      filterable
          			  defaultFilterMethod={(filter, row) =>
            			String(row[filter.id]).includes(filter.value.toLowerCase())}
                      />
                  </div>
              );
          }}
          />
        <br/>
      </div>
    );
  }
}

