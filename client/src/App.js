import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import MapView from './components/MapView';
import './App.css';

class App extends Component {
  state = {
    isLoading: true,
    data: null,
  }

  componentDidMount() {
    if (this.state.isLoading) {
      // dev mode -> uncomment 16 and comment line 17
      // axios.get('http://0.0.0.0:8000/userdevices/123/')
      axios.get('/userdevices/123/')
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
      <div className="App">
        { (!isLoading) ?
          <MapView sites={data.data} /> :
          <img src={logo} className="App-logo" alt="logo" />
        }
      </div>
    );
  }
}

export default App;
