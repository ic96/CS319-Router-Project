import React, { Component } from 'react';
import axios from 'axios';
import { compose, withProps, withStateHandlers } from "recompose";
import {
  InfoWindow,
  Marker,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import responsiveMarker from "../responsive.png";
import failureMarker from "../failure.png";

type MapViewProps = {
    center: {
        lat: string,
        long: string,
    },
    sites: [],
};

type MapViewState = {
    siteData: ?*,
    isLoading: Boolean,
    markers: [],
};

const PopUpRow = ({row}) => {
const { device_recid, device_type, device_manufacturer, device_description,
        device_ip_address, latency} = row;
        return(
            <tr>
                <td> {device_ip_address} </td>
                <td> {device_type} </td>
                <td> {device_manufacturer} </td>
                <td> {device_description} </td>
                <td> {latency} </td>
                <button>Reporting Graph</button>
                <button>Retrieve</button>
            </tr>
                )
            }

const PopUp = ({data}) => {
    return (
        <div className= "devicePopupRow">
            <table>
                <tbody>
                    <tr>
                        <th>IP Address</th>
                        <th>Device Type</th>
                        <th>Manufacturer</th>
                        <th>Description</th>
                        <th>Latency</th>
                    </tr>
                    {
                        data.map(device =>
                            <PopUpRow row = {device}/>
                         )
                    }
                </tbody>
            </table>
        </div>
    );
};


class MapView extends Component {
    props: MapViewProps;
    state: MapViewState;

    state = {
        siteData: null,
        isLoading: true,
    }

    // TODO: move to another fn (maybe utils.js)
    componentDidMount() {
        const { sites } = this.props;
        if (this.state.isLoading && sites) {
            const siteData = {};
            const deviceSiteMap = {};
            const promises = [];

            // basically here we get a bunch of queries for device data and wait for them all at once
            sites.forEach(site => {
                const siteId = site.site_id;

                siteData[siteId] = {
                    ...site,
                };

                // add device id + site id to map and add query for device data
                site.site_devices.forEach((device, i) => {
                    const recId = device.device_recid;
                    deviceSiteMap[recId] = {
                        siteId: siteId,
                        index: i,
                    };
                    // to work on development mode uncomment line 61 and comment line 62
                    promises.push(axios.get(`http://localhost:8000/device/${recId}/`));
                    // promises.push(axios.get(`/device/${recId}/`));

                });
            });

            Promise.all(promises).then(devices => {
                devices.forEach(result => {
                    const device = result.data;
                    const { latency, ip_address, device_id } = device;
                    const { siteId, index } = deviceSiteMap[device_id];
                    siteData[siteId].site_devices[index].latency = latency;
                });

                this.setState({
                    siteData,
                    isLoading: false,
                })
            }, err => {
                console.log(err);
            })

        }
    }

    render() {
        const google = window.google;
        const { center, sites } = this.props;
        const { siteData, isLoading } = this.state;
        let content = [];
        if (center && sites && google && !isLoading) {
            // console.log(siteData);
            Object.keys(siteData).forEach(siteId => {
                const site = siteData[siteId];

                // if there exists a device with no latency record assume it's down
                // this is bad but ship it 4 the demo LOL

                const nonResponsive = site.site_devices.some(device => {
                    return device.latency === undefined;
                });
                content.push(
                    <Marker
                        position={{
                            lat: Number(site.site_latitude),
                            lng: Number(site.site_longitude),
                        }}
                        icon={{
                            url: nonResponsive ? failureMarker : responsiveMarker
                        }}
                        onClick={() => {
                            siteData[siteId].isShowing = true;
                            this.setState({
                                siteData,
                                isLoading: false,
                            });
                        }}
                        key={siteId}
                    >
                        {
                            site.isShowing &&
                            <InfoWindow onCloseClick={() => {
                                siteData[siteId].isShowing = false;
                                this.setState({
                                    siteData,
                                    isLoading: false,
                                });
                            }}>
                                <div>
                                    {
                                        <PopUp data={site.site_devices}/>
                                    }
                                </div>
                            </InfoWindow>
                        }
                    </Marker>
                );
            });
        }

        return (<GoogleMap defaultZoom={3} defaultCenter={{ lat: 54.322498, lng: -108.583205 }}>
                {content}
              </GoogleMap>);
    }
}

const GoogleMapView = compose(
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBtotw0UsgNWBC8seKmjGg42ANAKHlZZ7c&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `800px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: { lat: 54.322498, lng: -108.583205 },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
    <MapView
        sites={props.sites}
        center={props.center}
    />
);

export default GoogleMapView;

