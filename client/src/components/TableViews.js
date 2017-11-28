import 'react-table/react-table.css'
import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "../Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
    {
        Header: "Name",
        accessor: "site_address1",
        // TODO: HANDLE ONCLICK THE SAME WAY HERE AS IN MAPVIEW
    },
    {
        Header: "Usage",
        id: "usage",
        accessor: d => d.usage
    },
    {
        Header: "Clients",
        accessor: "clients",

    },
    {
        Header: "Network Type",
        accessor: "network_type"
    }
    //{
    //     columns: [
    //         {
    //             Header: "Network Health",
    //             accessor: "network_health"
    //         }
    //     ]
    // }
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
                accessor: "latency",
                width: 150,
                getProps: (state, rowInfo, column, row) => {
                  if(rowInfo != null){
                    if (rowInfo.row['latency'] > 30000) {
                      console.log(rowInfo.row['latency']);
                      return{
                        style: {
                          background: 'red',
                        }
                      }
                    }

                    return {
                      style: {
                        background: 'green',
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


  render() {
    const { data, onSiteSelected, onDeviceSelected} = this.props;
      var devicesArray = [];
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
          defaultPageSize={5}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]).includes(filter.value)}
          className="-striped -highlight"
          SubComponent={row => {
              const siteDevices = row.original.site_devices;
              console.log(siteDevices);
              return (
                  <div style={{padding: "20px"}}>
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
                      data={siteDevices}
                      columns={subColumns}
                      defaultPageSize={data.length}
                      showPagination={false}
                      filterable
          			  defaultFilterMethod={(filter, row) =>
            			String(row[filter.id]).includes(filter.value)}
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

