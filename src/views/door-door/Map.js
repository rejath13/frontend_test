import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps, withStateHandlers } from 'recompose';

import greenMarker from "../../assets/images/map-icons/green-marker.svg";
import redMarker from "../../assets/images/map-icons/red-marker.svg";
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJwujaucAqjiBhstqgj2ykhwCQGOFcVco&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(() => ({
    isOpen: false,
    selectedId: 0,
  }), {
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
    onToggleOpen: ({ isOpen, selectedId }) => (Marker) => {
      isOpen= !isOpen;
      selectedId= Marker;
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={9}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}>
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
      maxZoom= {16}
    >
      {props.markers.map((marker,i) => {
        const index = i + 1;
        return (<Marker
          key={marker.log_id}
          label={marker.door_company}
          icon={marker.log_first_followup==1?greenMarker:redMarker}
          position={{ lat: parseFloat(marker.door_latitude), lng: parseFloat(marker.door_longitude) }}
        >{(props.selectedId==marker.log_id) && <InfoWindow onCloseClick={props.onToggleOpen}>
          <p>{marker.door_company}</p>
          </InfoWindow>}
        </Marker>
        
      )})}
    </MarkerClusterer>
  </GoogleMap>  
);

export default Map;