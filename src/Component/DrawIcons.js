import React, { Component } from 'react';
import {
  Map,
  GoogleApiWrapper,
  Polyline,
  Marker } from 'google-maps-react';

export class DrawIcons extends Component {
	render(){
		const google=window.google;
		
		const lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

         const path = [
            {lat: 21.026160, lng:105.855552},
            {lat: 21.026134, lng:105.855541}
        ]
		return(
			<Polyline
                path = {path}
                options={{
                    strokeColor: "#000000",
                    strokeOpacity: 0.95,
                    strokeWeight: 4.5,
                    icons: [
                    {
                        icon: lineSymbol,
                        offset: "100",
                    }]
                }}
            />
		)
	}
}

export default DrawIcons;