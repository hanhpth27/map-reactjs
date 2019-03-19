import React, { Component } from 'react';

import { Map, GoogleApiWrapper } from 'google-maps-react';
import { InfoWindow, Marker } from 'google-maps-react';
import { withGoogleMap, GoogleMap,Polyline } from 'react-google-maps';

const style = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

    render() {
        const google=window.google;

        const icon = {
            url: "car3.png", // url
            scaledSize: new google.maps.Size(30, 50)
        };

        var points = [
            { lat: 42.02, lng: -77.01 },
            { lat: 42.03, lng: -77.02 },
            { lat: 41.03, lng: -77.04 },
            { lat: 42.05, lng: -77.02 }
        ]
        var bounds = new this.props.google.maps.LatLngBounds();
        for (var i = 0; i < points.length; i++) {
          bounds.extend(points[i]);
        }

        const triangleCoords = [
          {lat: 21.0264925, lng: 105.8559776},
          {lat: 21.032542, lng: 105.840318},
          {lat: 21.0335423, lng: 105.8394487},
          {lat: 21.0430093, lng: 105.8361939},
          {lat: 21.0478722, lng: 105.8368076},
          {lat: 21.0367789, lng: 105.8346447},
        ];

        return (
            <Map 
                google={this.props.google}
                style={style}
                initialCenter={{
                  lat: 21.0264925, lng: 105.8559776
                }}
                zoom={15}
                onClick = {this.onMapClicked}
                  bounds={bounds}
              >
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.0264925, lng: 105.8559776}}
                    icon = {icon} 
                  />
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.032542, lng: 105.840318}}
                  />
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.0335423, lng: 105.8394487}}
                  />
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.0430093, lng: 105.8361939}}
                  />
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.0478722, lng: 105.8368076}}
                  />
                <Marker
                    name = {'Your position'}
                    position = {{lat: 21.0367789, lng: 105.8346447}}
                  />

                <Polyline
                    path={triangleCoords}
                    geodesic={true}
                    options={{
                        strokeColor: "#ff2527",
                        strokeOpacity: 0.75,
                        strokeWeight: 2,
                        icons: [
                            {                      
                                offset: "5.5",
                                repeat: "20px"
                            }
                        ]
                    }}
                  />


                  


            </Map>
        );
      }


}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDc2L7RMA_qzBVxIMKD1z6-FfMdOs32Vmc'
})(MapContainer);







