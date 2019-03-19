import { default as React, Component } from 'react';
import raf from 'raf';
import canUseDOM from 'can-use-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow,
  Marker,
  withScriptjs,
} from 'react-google-maps';
import geolib from 'geolib';
import { geolocated } from 'react-geolocated';
import ItemList from './ItemList';
import { Col } from 'react-bootstrap';

import Paper from 'material-ui/Paper';
import Img from 'react-image';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import CreateRadius from './CreateRadius';
import offerActions from '../../redux/actions/offerActions';

const googleMapURL =
  'https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyA7XEFRxE4Lm28tAh44M_568fCLOP_On3k';

const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const GeolocationGoogleMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap defaultZoom={6} zoom={props.zoom} center={props.center} onClick={props.onMapClick}>
      {props.center && (
        <Marker
          position={props.center}
          title={"User's Location"}
          options={{ icon: require('./assets/blueDot.png') }}
        >
          {props.showCenterInfo && (
            <InfoWindow>
              <div>User's Location</div>
            </InfoWindow>
          )}
        </Marker>
      )}
      {/* <Circle
          center={props.center}
          radius={props.zoom}
          options={{
            fillColor: 'red',
            fillOpacity: 0.2,
            strokeColor: 'red',
            strokeOpacity: 1,
            strokeWeight: 1,
          }}
        /> */}
      {props.markers.map((marker, index) => {
        const onClick = () => props.onMarkerClick(marker);
        const onCloseClick = () => props.onCloseClick(marker);

        return (
          <Marker
            key={index}
            position={marker.position}
            title={marker.number.toString()}
            onClick={onClick}
            options={{ icon: 'https://image.ibb.co/evMHxF/shopping_zone_marker_1.png' }}
          >
            {marker.showInfo && (
              <InfoWindow onCloseClick={onCloseClick}>
                <div>
                  <ItemList marker={marker} />
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </GoogleMap>
  )),
);

class OfferMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: null,
      center: null,
      content: null,
      radius: 15, // ACZ --> put this const in config_env.
      showCenterInfo: true,
      markers: [],
      zoom: 6,
      bounds: null,
    };

    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.filterItemsByRadius = this.filterItemsByRadius.bind(this);
    this.radiusChange = this.radiusChange.bind(this);
    this.zoomChange = this.zoomChange.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.coords && !props.coords.positionError) {
      this.setState({ center: { lat: props.coords.latitude, lng: props.coords.longitude } });
    } else {
      fetch('http://ip-api.com/json')
        .then(res => res.json())
        .then(data => {
          this.setState({ center: { lat: data.lat, lng: data.lon } });
        })
        .catch(error => {
          this.setState({ content: `Error: The Geolocation service failed (${error.message}).` });
        });
    }
    this.setState({ markers: props.items });
  }

  handleMapClick() {
    this.setState({ showCenterInfo: false });
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker._id === targetMarker._id) {
          return {
            ...marker,
            showInfo: true,
          };
        }
        return marker;
      }),
    });
  }

  handleCloseClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker._id === targetMarker._id) {
          return {
            ...marker,
            showInfo: false,
          };
        }
        return marker;
      }),
    });
  }

  filterItemsByRadius(userRadius) {
    const items = this.state.markers;
    const markers = [];
    const bounds = new google.maps.LatLngBounds();

    items.map((item, i) => {
      let itemGeolocation;
      let itemDescription = 'NO DESCRIPTION';
      let itemThumb;
      // Should be ready - tbaustinedit
      if (item) {
        itemDescription = item.description;
        itemThumb = item.media.mediaVault[item.media.defaultIdx] || {
          mediaType: 'txt',
        };
      }
      if (item.geolocation) {
        itemGeolocation = item.geolocation.coords;
      }
      if (this.state.center) {
        const currentLocation = {
          latitude: this.state.center.lat,
          longitude: this.state.center.lng,
        };
        const distanceArr = geolib.orderByDistance(currentLocation, [itemGeolocation]);
        const miles = (distanceArr[0].distance / 1609.34).toFixed(2);
        if (miles <= userRadius) {
          const loc = new google.maps.LatLng(itemGeolocation.lat, itemGeolocation.lng);
          bounds.extends(loc);
          markers.push({
            _id: item._id,
            position: itemGeolocation,
            number: i,
            content: itemDescription,
            price: item.price,
            quantity: item.quantity,
            currency: item.currency,
            category: item.category,
            title: item.title,
            offer: item.offer,
            thumbnail: itemThumb,
            showInfo: item.showInfo || false,
          });
        }
      }
    });
    this.setState({
      bounds,
    });
    return markers;
  }

  radiusChange(event) {
    console.log(event.target.value);
    this.setState({
      radius: event.target.value,
    });

    const { filter } = this.props.offers;
    filter.radius = event.target.value;
    this.props.sortOffersNew(filter);
  }

  zoomChange(e) {
    console.log('value', e.target.value);
    this.setState({ zoom: Number(e.target.value) });
  }

  render() {
    const markers = this.filterItemsByRadius(this.state.radius);
    return (
      <Col xs={12} smOffset={0} mdOffset={0}>
        <div>
          <div style={{ fontFamily: 'Roboto', fontStyle: 'normal' }}>
            Offers within radius of: {' '}
            <input type="text" defaultValue={this.state.radius} onChange={this.radiusChange} /> {' '}
            miles
            <br />
          </div>
          {/* <CreateRadius
            radiusChange={this.radiusChange}
            numOffers={markers.length}
            initRadius={this.state.zoom}
          /> */}
        </div>
        <br />

        <div
          style={{
            width: '100%',
            height: '500px',
          }}
        >
          <GeolocationGoogleMap
            googleMapURL={googleMapURL}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            center={this.state.center}
            showCenterInfo={this.state.showCenterInfo}
            content={this.state.content}
            radius={this.state.radius}
            onMapClick={this.handleMapClick}
            onMarkerClick={this.handleMarkerClick}
            onCloseClick={this.handleCloseClick}
            markers={markers}
            zoom={this.state.zoom}
            bounds={this.state.bounds}
          />
        </div>
      </Col>
    );
  }
}

function mapStateToProps({ browser, offers }) {
  return { browser, offers };
}

const dispatchToProps = dispatch => ({
  sortOffersNew: filter => dispatch(offerActions.sortOffers(filter)),
});

export default connect(mapStateToProps, dispatchToProps)(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(OfferMap),
);