import React, { Component } from 'react';
import Direction from './Component/Direction';
import SymbolPath from './Component/SymbolPath';
import callApi from './utils/apiCaller';

import {
  Map,
  GoogleApiWrapper,
  Polyline,
  MarkerWithLabel,
  Marker } from 'google-maps-react';

const style = {
  width: '100%',
  height: '100%'
};

const stopBus = [
        ['1', 21.026463, 105.855659],
        ['2', 21.032294, 105.839528],
        ['3', 21.0335833, 105.8390984],
        ['4', 21.0430283, 105.835951],
        ['5', 21.0481377, 105.8379459],
        ['6', 21.033662, 105.836638],
        ['7', 21.030366, 105.836084],
        ['8', 21.024697, 105.845832],
        ['9', 21.028894, 105.849503],
        ['10', 21.023120, 105.851203],
        ['11', 21.024153, 105.857194]
      ];
const points = [
          {lat: 21.026463, lng: 105.855659},
          {lat: 21.032294, lng: 105.839528},
          {lat: 21.0335833, lng: 105.8390984},
          {lat: 21.0430283, lng: 105.835951},
          {lat: 21.0481377, lng: 105.835951},
          {lat: 21.033662, lng: 105.836638},
          {lat: 21.030366, lng: 105.836084},
          {lat: 21.024697, lng: 105.845832},
          {lat: 21.028894, lng: 105.849503},
          {lat: 21.023120, lng: 105.851203},
          {lat: 21.024153, lng: 105.857194}
      ]


export class MapContainer extends Component {

    constructor(props) {
      super(props);

      this.state = {
        items: []
      };
    }

    componentDidMount(){
      callApi('position', 'GET', null).then(res =>{
          this.setState({
              items : res.data
          });
        });
    }

    render() {

        const google=window.google;

        const iconCar = {
            url: "car3.png",
            scaledSize: new google.maps.Size(30, 50)
        };
        const busStop={
          url:"bb1.png",
          scaledSize: new google.maps.Size(30, 30)
        }

        const symbol = {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,

        }

        const { items } = this.state;
        console.log(items[0]);
        const bounds  = new google.maps.LatLngBounds();

        for (var i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }


        return (

            <Map
                google={this.props.google}
                style={style}
                onClick = {this.onMapClicked}
                bounds = {bounds}
                panToBounds = {bounds} //auto-center
                fitBounds = {bounds} // auto-zoom
                
              >


                {items.map(item => (
                  <Marker
                    key={item.id_driver}
                    name = {'Your position'}
                    position = {{lat: item.lat,lng: item.lng}}
                    icon = {iconCar}
                  />

                  ))}

                {stopBus.map(stop=>(
                  <Marker
                    name = {'Your position'}
                    position = {{lat: stop[1],lng: stop[2]}}
                    label= {stop[0]}
                    icon = {busStop}
                  />
                ))}

                <Polyline
                    path={Direction}
                    geodesic={true}
                    options={{
                        strokeColor: "#ff2527",
                        strokeOpacity: 0.95,
                        strokeWeight: 4.5,
                        icons: [
                            {
                                offset: "5.5",
                                repeat: "20px"
                            }
                        ]
                    }}
                  />

                {SymbolPath.map(paths=>(
                  <Polyline
                    path={paths}
                    options={{
                        strokeColor: "#ff227",
                        strokeOpacity: 0.95,
                        strokeWeight: 3,
                        icons: [
                            {
                                icon: symbol,
                                offset: "5.5",
                            }
                        ]
                    }}
                  />
                ))}

            </Map>


        );
      }


}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDc2L7RMA_qzBVxIMKD1z6-FfMdOs32Vmc'
})(MapContainer);
