import 'react-table/react-table.css'
import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "../Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
    {
        columns: [
            {
                Header: "Name",
                accessor: "site_address1"
            },
            {
                Header: "Usage",
                id: "usage",
                accessor: d => d.usage
            }
        ]
    },
    {
        columns: [
            {
                Header: "Clients",
                accessor: "clients"


            }
        ]
    },
    {
        columns: [
            {
                Header: "Network Type",
                accessor: "network_type"
            }
        ]
    },
    {
        columns: [
            {
                Header: "Network Health",
                accessor: "network_health"
            }
        ]
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
                Header: "Latency",
                accessor: "latency"
            }
        ]
    }
];

const SubTable = ({data}) => {
    return(
        data.map(sites =>
        sites.site_devices.map(devices =>
            <ReactTable
                data={devices}
                columns={subColumns}
                defaultPageSize={3}
                showPagination={false}
            />
        )
    )
)
}

export default class TableView extends React.Component {


  render() {
    const { data } = this.props;
      var devicesArray = [];
    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          SubComponent={row => {
              const siteDevices = row.original.site_devices;
              console.log(siteDevices);
              return (
                  <div style={{padding: "20px"}}>
                      <ReactTable
                      data={siteDevices}
                      columns={subColumns}
                      defaultPageSize={10}
                      showPagination={false}
                      />

                  </div>
              );
          }}
          />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}

