import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose } from 'recompose';

const MapWithAMarker = compose(
    withScriptjs,
    withGoogleMap
)(props =>
    <div>
        <p>{props.lat}, {props.lng}</p>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: props.lat, lng: props.lng }}
        >
            <Marker
                position={{ lat: props.lat, lng: props.lng }}
            />
        </GoogleMap>
    </div>
);

export default MapWithAMarker;