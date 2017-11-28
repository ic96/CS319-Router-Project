import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import ChartView from './components/ChartView';
import MapView from './components/MapView';
import { UniserveHeader, UniserveMenu, UniserveFooter } from './components/UniserveComponents'
import './App.css';
import './components/css/uniserve.css';
import {render} from "react-dom"
import TableViews from './components/TableViews'


// move this somewhere else
class LoginMenu extends Component {
  state = {
    username: '',
    password: '',
  }

  handleChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  }

  handleChangePassword = (event) => {
    this.setState({ password: event.target.value });
  }

  render() {
      return (
        <div>
          <label>
            Username: &nbsp;
            <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
          </label>
          <label>
            Password: &nbsp;
            <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
          </label>
          <input type="submit" value="Submit" onClick={() => {
            this.props.handleSubmit(this.state.username, this.state.password)
          }} />
          </div>
        );
  }
};

class App extends Component {
  state = {
    isLoading: true,
    data: null,
    selectedIds: {},
    companyRecId: null,
  };

  onClearChart = () => {
    this.setState({
      selectedIds: {},
    });
  };

  // show graph for site
  onSiteSelected = siteDevices => {
    const selectedIds = this.state.selectedIds;
    siteDevices.forEach(device => {
      selectedIds[device.device_recid] = selectedIds[device.device_recid] ? false : true;
    });
    this.setState({
      selectedIds,
    });
  };

  // show graph for device
  onDeviceSelected = deviceRecId => {
    const selectedIds = this.state.selectedIds;
    selectedIds[deviceRecId] = selectedIds[deviceRecId] ? false : true;
    this.setState({
      selectedIds,
    });
  };

  handleSubmit = (username, password) => {
    // axios.get(`http://0.0.0.0:8000/login?username=${username}&password=${password}`)
    axios.get(`/userlogin/?username=${username}&password=${password}`)
    .then(response => {
        this.setState({
          companyRecId: response.data === 'None' ? null : response.data,
        });
    }, err => {
      console.log(err);
    });
  }

  componentDidUpdate() {
    const { isLoading, companyRecId } = this.state;
    if (isLoading && companyRecId) {
      // dev mode -> uncomment 16 and comment line 17
      // axios.get(`http://0.0.0.0:8000/userdevices/${companyRecId}/`)
      axios.get(`/userdevices/${companyRecId}/`)
        .then(response => {
          this.setState({
            isLoading: false,
            data: response,
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    const { isLoading, data, selectedIds, companyRecId } = this.state;
    const validIds = Object.keys(selectedIds).filter(key => {
      return selectedIds[key];
    });
    return (
      <div>
        <div className="App">
          <UniserveHeader />
          <UniserveMenu />
          {
            companyRecId ?
            ((!isLoading) ?
            <div className='page'>
              <div className="mapChart">
                <MapView
                  sites={data.data}
                  onSiteSelected={this.onSiteSelected}
                  onDeviceSelected={this.onDeviceSelected}
                  className="map"
                />
                <ChartView
                  deviceIds={validIds}
                  handleClearChart={this.onClearChart}
                  className="chart"
                />
              </div>
              <TableViews
                data={data.data}
                onSiteSelected={this.onSiteSelected}
                onDeviceSelected={this.onDeviceSelected}
              />
            </div>:
            <img src={logo} className="App-logo" alt="logo" />
            ) :
            <LoginMenu handleSubmit={this.handleSubmit} />
          }
          <UniserveFooter />
        </div>
      </div>
    );
  }
}

export default App;
