import React from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { SiCashapp } from "react-icons/si";
import { Row, Col, Badge, Card, Dropdown } from "react-bootstrap";
import { format } from "date-fns";
import {
  statusOptions,
  getStatusColor,
  MySweetAlert,
  getStatusDate,
  fetchLocalData,
  fetchUserId,
} from "../paymenthelper";
import { useToasts } from "react-toast-notifications";
import { useDeletePaymentMutation } from "../../../store/api/payments/paymentApi";

const PaymentCard = ({
  paymentData,
  handleEdit,
  handleChangeStatus,
  handleCardClick,
  active,
  index,
  currentPage,
}) => {
  const { addToast } = useToasts();

  const [deletePayment] = useDeletePaymentMutation();

  const handleDelete = (paymentId) => {
    const userType = fetchLocalData("loginUserType");
    const userName = fetchLocalData("loginUserName");
    const userId = fetchUserId();
    if (userType === "admin" || userName === "Celine" || userId == 7) {
      MySweetAlert.fire({
        text: "Are you sure to delete the payment ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#16D36B",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result?.isConfirmed) {
          deletePayment(paymentId)
            .then((response) => {
              if (response?.data?.success) {
                addToast(response?.data?.message, {
                  appearance: "success",
                  autoDismiss: true,
                });
              } else {
                addToast(response?.data?.message, {
                  appearance: "error",
                  autoDismiss: true,
                });
              }
            })
            .catch((error) => {
              console.log("Error in deleting the payment", error);
              addToast("Something went wrong!", {
                appearance: "error",
                autoDismiss: true,
              });
            });
        }
      });
    } else {
      addToast("You are not allowed to delete.", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };

  // ===== for copying data to clipboard 
  const handleCopy = (paymentData) => {
    let dataToCopy = {
      Date: format(new Date(paymentData?.date), "yyyy-MM-dd"),
      "Posted By": paymentData?.user?.name,
      "Company Name": paymentData?.companyName,
      "Collected By": paymentData?.collectedBy || paymentData?.status,
      "Contact Person": paymentData?.contactName,
      "Contact Number": paymentData?.contactNumber,
      Amount: `${paymentData?.amount} - ${paymentData?.paymentType}`,
      Status: `${paymentData?.status} - ${getStatusDate(
        paymentData?.status,
        paymentData
      )}`,
      Note :paymentData?.note || "No Comments",
      Remarks : paymentData?.remarks[0]?.remark || "No Remark",
      Location : `https://www.google.com/maps?q=${paymentData?.latitude},${paymentData?.longitude}`,
    };

    const formattedData = Object.entries(dataToCopy)
      ?.map(([key, value]) => `${key} : ${value}`)
      .join("\n");

  // ========================= NOT WORKING IN PRODUCTION
    // navigator.clipboard
    //   .writeText(formattedData)
    //   .then(() =>
    //     addToast("Data copied to clipboard", {
    //       appearance: "success",
    //       autoDismiss: true,
    //     })
    //   )
    //   .catch(() => console.log("Error in copying data"));
    // ===================================================
    const textarea = document.createElement('textarea');
      textarea.value = formattedData;
      document.body.appendChild(textarea);
      textarea.select();
      try {
          document.execCommand('copy');
          addToast("Data copied to clipboard", {
                    appearance: "success",
                    autoDismiss: true,
                  })
      } catch (error) {
          console.error('Error copying text to clipboard:', error);
      } finally {
          document.body.removeChild(textarea);
      }
  };

  return (
    <Card
      className={`card-container ${active ? "active-card" : ""}`}
      onClick={() => handleCardClick(paymentData)}
    >
      <Card.Body>
        <Row>
          <Col xs={1}>
            <Badge variant="primary">
              #{currentPage === 0 ? index + 1 : currentPage * 20 + index + 1}
            </Badge>
          </Col>
          <Col xs={11}>
            <Row>
              <Col xs={6}>
                <strong>Date:</strong>{" "}
                <small>
                  {format(new Date(paymentData?.date), "yyyy-MM-dd")}
                </small>
              </Col>
              <Col xs={6}>
                <strong>Posted By:</strong>{" "}
                <small>{paymentData?.user?.name}</small>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <strong>Company:</strong>{" "}
                <small className="company-name">
                  {paymentData?.companyName}
                </small>
              </Col>
              <Col xs={6}>
                <strong>Collected By:</strong>{" "}
                <small>
                  {paymentData?.collectedBy && (paymentData?.status === "collected" || paymentData?.status === "recorded")
                    ? paymentData?.collectedBy
                    : paymentData?.status}
                </small>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <strong>Contact:</strong>{" "}
                <small>{paymentData.contactName}</small>
              </Col>
              <Col xs={6}>
                <strong>PH:</strong> <small>{paymentData?.contactNumber}</small>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <strong>Note:</strong> <small>{paymentData?.note || "No Comments"}</small>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <strong>Remarks:</strong> <small>{paymentData.remarks[0]?.remark || "No Remark"}</small>
              </Col>
            </Row>
            <Row>
              <Col
                xs={4}
                className="flex align-items-center justify-content-center"
              >
                {paymentData?.paymentType === "cheque" ? (
                  <FaMoneyCheckAlt />
                ) : (
                  <SiCashapp />
                )}
                <strong style={{ fontSize: "0.8rem" }}>
                  : {paymentData?.amount}
                </strong>
              </Col>
              <Col xs={5}>
                <Row>
                  <Dropdown
                    className="status-box"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Dropdown.Toggle
                      style={{
                        backgroundColor: getStatusColor(paymentData?.status),
                      }}
                      id="dropdown-basic"
                      className="status-box"
                    >
                      {paymentData?.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="status-options">
                      {statusOptions?.map((status) => (
                        <Dropdown.Item
                          key={status.value}
                          onClick={() =>
                            handleChangeStatus(status.value, paymentData.id)
                          }
                          active={paymentData.status === status.value}
                        >
                          {status?.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  {paymentData?.status !== "open" && (
                    <small className="status-date">
                      {getStatusDate(paymentData?.status, paymentData)}
                    </small>
                  )}
                </Row>
              </Col>
              <Row>
                {/* <Col xs={8}></Col> */}
                <Col
                  xs={2}
                  className="ml-auto d-flex justify-content-end"
                  onClick={(e) => e?.stopPropagation()}
                >
                  <i
                    className="feather icon-edit text-success mx-2 mt-2"
                    title="Edit Payment"
                    onClick={() => handleEdit("edit", paymentData)}
                  ></i>
                  <i
                    className="feather icon-trash text-danger mx-2 mt-2"
                    title="Delete Payment"
                    onClick={() => handleDelete(paymentData?.id)}
                  ></i>
                  <i
                    className="feather icon-copy text-secondary mx-2 mt-2"
                    title="Copy Payment"
                    onClick={() => handleCopy(paymentData)}
                  ></i>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
        {/* Edit and delete Buttons */}
      </Card.Body>
    </Card>
  );
};

export default React.memo(PaymentCard);
