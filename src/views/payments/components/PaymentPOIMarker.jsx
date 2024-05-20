import React, { useEffect, useState } from "react";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { findCenter, getPOIMarker } from "../paymenthelper";

const PaymentPOIMarker = ({ payment, activePayment }) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [google, setGoogle] = useState(window.google);

  const handleMarkerClick = (payment) => {
    if (selectedMarkerId === payment.id) {
      setSelectedMarkerId(null);
    } else {
      setSelectedMarkerId(payment?.id);
    }
  };

  useEffect(() => {
    setSelectedMarkerId(activePayment?.id);
  }, [activePayment?.id]);

  return (
      <Marker
        position={findCenter(payment?.latitude, payment?.longitude)}
        onClick={() => handleMarkerClick(payment)}
        icon={getPOIMarker(payment?.status)}
      >

      {selectedMarkerId == payment?.id && (
        <InfoWindow
          position={findCenter(payment?.latitude, payment?.longitude)}
          onCloseClick={() => setSelectedMarkerId(null)}
        >
          <div className="d-flex flex-column">
            <strong className="mb-2">{payment.companyName}</strong>
            <strong className="mb-2">Amount : {payment?.amount?.toUpperCase()}</strong>
            <strong className="mb-2">Payment Type : {payment?.paymentType?.toUpperCase()}</strong>
            <strong className="mb-2">Original Invoice : {payment?.originalInvoice?.toUpperCase()}</strong>
            <strong className="mb-2">Note : {payment?.note || "No Comments"}</strong>
            <strong className="mb-2">Remarks : {payment?.remarks[0]?.remark || "No Remarks"}</strong>
          </div>
        </InfoWindow>
      )}
      </Marker>
  );
};

export default React.memo(PaymentPOIMarker);
