import React, { PureComponent } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

type ChartViewProps = {
    sites: [],
};

type CharViewState = {
    isLoading: Boolean,
    data: ?*,
};

class ChartView extends PureComponent {
    state: CharViewState;
    props: ChartViewProps;

    state = {
        isLoading: true,
        data: null,
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    formatData(data) {
        const formattedData = {
          labels: [],
          datasets: [],
        };
        // each res is the response from the promise
        data.forEach(result => {
            // some default settings for the line
            const currentColor = this.getRandomColor();
            const dataset = {
              label: result.data.ip_address,
              fill: false,
              lineTension: 0.1,
              backgroundColor: currentColor,
              borderColor: currentColor,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              // pointBorderColor: 'rgba(75,192,192,1)',
              // pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              // pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: []
            };

            // convert each record to javascript date object
            result.data.map(record => {
                record.date_recorded = new Date(record.date_recorded);
                return record;
            // sort ascending order
            }).sort((a, b) => {
                return a.date_recorded - b.date_recorded;
            // push to dataset
            }).forEach((record, i) => {
                if (!formattedData.labels[i]) {
                    formattedData.labels.push(record.date_recorded);
                }
                dataset.data.push(record.latency);
                dataset.label = record.ip_address;
            });

            formattedData.datasets.push(dataset)
        });

        return formattedData;
    }

    componentDidMount() {
        const { sites } = this.props;
        const promises = [];
        sites.forEach(site => {
            site.site_devices.forEach(device => {
                promises.push(axios.get(`/devicehistory/${device.device_recid}/`));
                // promises.push(axios.get(`http://0.0.0.0:8000/devicehistory/${device.device_recid}/`));
            });
        });

        Promise.all(promises)
        .then(res => {
            const formattedData = this.formatData(res);
            console.log(res);
            this.setState({
                isLoading: false,
                data: formattedData,
            });
        }, err => {
            console.log(err);
        });
    }

    render() {
        const { data, isLoading } = this.state;
        if (isLoading) {
            return <Line/>;
        } else {
            return <Line data={data}/>;
        }
    }
};

export default ChartView;