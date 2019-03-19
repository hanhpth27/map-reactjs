import React, { Component } from 'react';
import { 
  Map, 
  GoogleApiWrapper, 
  Polyline, 
  Marker } from 'google-maps-react';

export class TestImages extends Component {

	constructor(props){
	    super(props);
	    this.state = {
	      rotation: 30
	    };
	    this.rotate = this.rotate.bind(this); 
	}

	rotate() {
	  var newRotation = this.state.rotation + 20;
	  this.setState({
	    rotation: newRotation
	  });

	}

	updatee(){
		var newRotation;
		this.setState((prevState, props) => {
			return{
			    rotation: prevState.rotation + 30
			};

	      
		    });


	}

	render() {
		const { rotation } =  this.state;


		


		const rot = {
		    transform: `rotate(${{rotation}}deg)`
		};

	    return (
	      	<div>
	   	    	<div> hiiiiii  </div>
	            <img style={{transform: `rotate(${rotation}deg)`}} src="car3.png" className="img-responsive" alt="Image"/>

	            <input onClick={this.rotate} type="button" value="right" />
	        </div>
	    );

	}
}


export default TestImages;