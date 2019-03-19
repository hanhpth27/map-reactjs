import React, { Component } from 'react';

import {
  Map,
  GoogleApiWrapper,
  Polyline,
  Marker } from 'google-maps-react';

const style = {
  width: '100%',
  height: '100%'
};

export class Demo extends Component {
	render(){
		const map = new google.maps.Map({
			style: style,
            center: {lat: 21.036202,lng: 105.845172},
            zoom : 15
		});

		return(
			{this.map}
		)
	}
}

export default Demo;