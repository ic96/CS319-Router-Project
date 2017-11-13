import 'react-table/react-table.css'
import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "../Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class TableView extends React.Component {


  
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div>
        <ReactTable
          data={data}
          columns={[
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
                },
                {
                  Header: "Tags",
                  accessor: "tags"
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
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}
