import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import MapView from './components/MapView';
import { UniserveHeader, UniserveMenu, UniserveFooter } from './components/UniserveComponents'
import './App.css';
import './components/css/uniserve.css';
import {render} from "react-dom"
import TableViews from './components/TableViews'


class App extends Component {
  state = {
    isLoading: true,
    data: null,
  }

  componentDidMount() {
    if (this.state.isLoading) {
      // dev mode -> uncomment 16 and comment line 17
      // axios.get('http://0.0.0.0:8000/userdevices/123/')
      axios.get('/userdevices/1000/')
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
    const { isLoading, data } = this.state;

    return (
      <div>
        <div className="App">
          <UniserveHeader />
          <UniserveMenu />
          { (!isLoading) ?
            <div className='page'>
              <MapView sites={data.data} />
              <TableViews data = {data.data}/>
            </div>:
            <img src={logo} className="App-logo" alt="logo" />
          }
          <UniserveFooter />
        </div>
      </div>
    );
  }
}

export default App;
