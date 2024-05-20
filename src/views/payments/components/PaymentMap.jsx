import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, TrafficLayer } from "@react-google-maps/api";
import { fetchVehicleToken, findCenter, storeLocally } from "../paymenthelper";
import PaymentPOIMarker from "./PaymentPOIMarker";
import "./paymentmap.scss";
import {
  useGetVehiclePositonsMutation,
  useVehicleLoginMutation,
} from "../../../store/api/payments/paymentApi";
import PaymentVehicleMarker from "./PaymentVehicleMarker";
import { Form } from "react-bootstrap";

const containerStyle = {
  height: "100%",
};

function PaymentMap({
  payments = [],
  activePayment,
  isLocation,
  locationCoords,
}) {
  const [center, setCenter] = useState({ lat: 23.4241, lng: 53.8478 });

  // ============== setting center according to the map
  useEffect(() => {
    let newCenter;
    if (
      activePayment &&
      activePayment.data &&
      activePayment.data.latitude &&
      activePayment.data.longitude
    ) {
      newCenter = findCenter(
        activePayment.data.latitude,
        activePayment.data.longitude
      );
    } else if (
      isLocation &&
      locationCoords &&
      locationCoords.lat &&
      locationCoords.lng
    ) {
      newCenter = locationCoords;
    } else {
      newCenter = { lat: 25.2048493, lng: 55.2707828 };
    }
    setCenter(newCenter);
  }, [activePayment, locationCoords, isLocation]);

  // =============== For Vehicle Login & Vehicle Positions
  const [vehicleAuthToken, setAuthVehicleToken] = useState(
    fetchVehicleToken() || ""
  );
  const [vehicleLogin] = useVehicleLoginMutation();
  const [getVehiclePositons] = useGetVehiclePositonsMutation();
  const [vehiclePositions, setVehiclePosition] = useState([]);
  const [hideVehicle, setHideVehicle] = useState(true);

  // fetching vehicle positions
  const fetchVehiclePositions = async (token) => {
    try {
      const { data } = await getVehiclePositons(token);
      if (data?.success && data?.data) {
        setVehiclePosition(data.data.positions);
      } else {
        console.log("Vehicle position fetching failed")
      }
    } catch (error) {
      console.log(error, "Error in fetching vehicle positons");
    }
  };

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const { data } = await vehicleLogin();
        if (data?.success && data?.vehicleAuthToken) {
          storeLocally("authVehicleToken", data.vehicleAuthToken);
          setAuthVehicleToken(data.vehicleAuthToken);
          fetchVehiclePositions(data.vehicleAuthToken);
        } else {
          console.log("Vehicle position fetching failed")
        }
      } catch (error) {
        console.log(error, "Error in vehicle login");
      }
    };

    if (!vehicleAuthToken || vehicleAuthToken == "undefined") {
      handleLogin();
    } else {
      fetchVehiclePositions(vehicleAuthToken);
    }
  }, [vehicleLogin, getVehiclePositons]);

  // HTTP POLLING TO FIND VEHICLES
  useEffect(() => {
    const fetchPositions = setInterval(() => {
      if (vehicleAuthToken) {
        fetchVehiclePositions(vehicleAuthToken);
      }
    }, 5000);

    return () => clearInterval(fetchPositions);
  }, [vehicleAuthToken, fetchVehiclePositions]);

  // =============== for setting and resetting zoom sizes
  const [mapZoom, setMapZoom] = useState(0);
  const [map, setMap] = useState(null);

  const handleZoomChanged = useCallback(() => {
    if (map) {
      setMapZoom(map.getZoom());
    }
  }, [map]);

  
  const onLoad = useCallback((map) => setMap(map), []);

  useEffect(() => {
    if (map) {
      map.addListener("zoom_changed", handleZoomChanged);

      return () =>
        new window.google.maps.event.clearListeners(map, "zoom_changed");
    }
  }, [map, handleZoomChanged]);

  useEffect(() => {
    if (activePayment?.id && mapZoom !== 12) {
      setMapZoom(12);
    } else if (!activePayment?.id && mapZoom !== 8) {
      setMapZoom(8);
    }
  }, [activePayment?.id]);

  // ============ for setting the traffice layers
  const [trafficLayer, setTrafficLayer] = useState(null);

  useEffect(() => {
    if (map && trafficLayer) {
      trafficLayer.setMap(map);
    }
  }, []);

  return (
    //   ============== commented due to refresh issue, need to fix it later
    // <LoadScript
    //   googleMapsApiKey="AIzaSyCVtBGriVB1AJ-oRgXJHzmwhrOyQYPUTrA"
    //   loadingElement={<div>Fetching Location...</div>}
    //   onLoad={() => setIsLoaded(true)}
    // >

    <GoogleMap
      id={isLocation ? "payment-map-small" : "payment-map-big"}
      onLoad={onLoad}
      onUnmount={() => setMap(null)}
      // center={findCenter(payments[0]?.latitude, payments[0]?.longitude)}
      center={center}
      mapContainerStyle={containerStyle}
      zoom={mapZoom}
      options={ {
        gestureHandling: 'greedy'
      }}
    ><>
      {!isLocation ? (
        <>
          {payments?.map((payment) => (
            <div key={payment?.id}>
              <PaymentPOIMarker
                payment={payment}
                activePayment={activePayment}
              />
            </div>
          ))}
           {/* Vehicles marker needs to be implemented */}
           {hideVehicle && vehiclePositions && vehiclePositions?.length > 0 && (
                <PaymentVehicleMarker vehiclePositions={vehiclePositions} />
             )}
          {map && (
            <Form className="vehicle-check d-flex align-items-center justify-content-center">
                <Form.Check type="checkbox" label="Vehicles" checked={hideVehicle} onChange={(event) => setHideVehicle(event.target.checked)}/>
            </Form>
          )}
        </>
      ) : (
        <Marker
          position={locationCoords}
          icon={{
            // svg
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: "red",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1.6,
            anchor: new window.google.maps.Point(12, 24),
          }}
        />
      )}
       <TrafficLayer
          onLoad={(layer) => setTrafficLayer(layer)}
          onUnmount={(layer) => setTrafficLayer(null)}
        />
    </>
    </GoogleMap>

    // </LoadScript>
  );
}

export default React.memo(PaymentMap);
