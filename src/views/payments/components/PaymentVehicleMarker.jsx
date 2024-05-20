import React, { useEffect, useRef, useState } from "react";
import { findCenter } from "../paymenthelper";
import { InfoWindow, Marker, OverlayView } from "@react-google-maps/api";
import { getVehicleMarker } from "../paymenthelper";
import "./PaymentVehicleMarker.scss";

const PaymentVehicleMarker = ({ vehiclePositions }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [google, setGoogle] = useState(null);
  const overlayViewRefs = useRef([]);

  useEffect(() => {
    if (window.google) setGoogle(window.google);
  }, []);

  const handleMarkerClick = (marker) => {
    if (activeMarker === marker) {
      return setActiveMarker(null);
    }
    setActiveMarker(marker);
  };

  return vehiclePositions?.map((position, index) => (
    <div key={`marker-${index}`}>
      <Marker
        position={findCenter(position?.latitude, position?.longitude)}
        icon={getVehicleMarker(position?.attributes?.state)}
        onClick={() => handleMarkerClick(position?.id)}
      >
        {activeMarker === position?.id && (
          <InfoWindow
            position={findCenter(position?.latitude, position?.longitude)}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="vehicle-label">
              <strong className="vehicle-para mb-2">
                Device Name : {position?.DeviceName}
              </strong>
              <strong className="vehicle-para">
                Status : {position?.attributes?.state?.toUpperCase()}
              </strong>
            </div>
          </InfoWindow>
        )}
      </Marker>
      <OverlayView
        position={findCenter(position?.latitude, position?.longitude)}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div
          ref={(ref) => (overlayViewRefs.current[index] = ref)}
          className="marker-label"
        >
          {position?.DeviceName}
        </div>
      </OverlayView>
    </div>
  ));
};

export default React.memo(PaymentVehicleMarker);
