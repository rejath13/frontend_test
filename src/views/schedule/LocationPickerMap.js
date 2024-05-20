import React, { useState } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";


const LocationPickerMap = ( props ) => {

    const { handleOnLocationChange = () => {}} = props

    const [marker,setMarker] = useState({ lat: 25.1972295, lng: 55.27974699})


    const handleOnMapClick = (e) => {
        setMarker({
            lat : e.latLng.lat(),
            lng : e.latLng.lng(),
        })

        handleOnLocationChange({
            lat : e.latLng.lat(),
            lng : e.latLng.lng(),
        })

    }

    const Map = compose(
        withProps({
          googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-ahgqsPN7HgQz_2fjWFLlUYzQkI6FHKo&v=3.exp&libraries=geometry,drawing,places",
          loadingElement: <div style={{ height: `100%` }} />,
          containerElement: <div style={{ height: `200px`, marginTop : 10 }} />,
          mapElement: <div style={{ height: `100%` }} />,
          center: marker,
        }),
        withScriptjs,
        withGoogleMap
      )(props =>
        <GoogleMap 
            onClick={handleOnMapClick}
            defaultZoom={12} 
            defaultCenter={props.center}>
                <Marker position={marker} />
        </GoogleMap>
    );
      
    
    return(<React.Fragment>
        <Map />
    </React.Fragment>)

}



export default LocationPickerMap;
