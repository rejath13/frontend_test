import { Modal, Button, Form, InputGroup, Row, Col, Accordion } from "react-bootstrap";

// import "../securepath.scss";
import "../securevehicle.scss";
import { useForm } from "react-hook-form";
import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToasts } from "react-toast-notifications";
import { useUpdatevehiclesMutation } from "../../../store/api/securepath/securepathApi";

function UpdateVehicleModal({ showUpdateModal, CloseUpdateModal, data,table,setPagination }) {
  const [updatevehicles, { isSuccess, error }] = useUpdatevehiclesMutation();
  const { addToast } = useToasts();
  const pageIndex=table.getState().pagination.pageIndex
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const UserID=localStorage.getItem('loginUserId')
    CloseUpdateModal();
    
    const res = await updatevehicles({UserID,...data});
   
    if (res?.data?.status == true) {
      addToast("Data Updated!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Something Went Wrong!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  let status = [
    {
      value: "active",
      name: "ACTIVE",
    },
    {
      value: "expired",
      name: "EXPIRED",
    },
    {
      value: "installed",
      name: "INSTALLED",
    },
    {
      value: "not installed",
      name: "NOT INSTALLED",
    },
    {
      value: "certificate only",
      name: "CERTIFICATE ONLY",
    },
    {
      value: "removed",
      name: "REMOVED",
    },
  ];

  let payment = [
    {
      value: "paid",
      name: "paid",
    },
    {
      value: "not paid",
      name: "not paid",
    },
  ];

  let emirates = [
    {
      value: "Abu Dhabi",
      name: "Abu Dhabi",
    },
    {
      value: "Dubai",
      name: "Dubai",
    },
    {
      value: "Sharjah",
      name: "Sharjah",
    },
    {
      value: "Ajman",
      name: "Ajman",
    },
    {
      value: "Umm Al Quwain",
      name: "Umm Al Quwain",
    },
    {
      value: "Ras Al Khaimah",
      name: "Ras Al Khaimah",
    },
    {
      value: "Fujairah",
      name: "Fujairah",
    },
  ];
  let type = [
    {
      value: "securepath premium",
      name: "securepath premium",
    },
    {
      value: "securepath",
      name: "securepath",
    },
    {
      value: "shahin",
      name: "shahin",
    },
  ];
  // 'locator+securepath','securepath','securepathprem','securepathprem+locator','rasid','rasid+locator','shahin','shahin+locator'
  // 'securepath premium','securepath','shahin'
  return (
    <>
      <div></div>
      <Modal
        show={showUpdateModal}
        onHide={() => {
          reset();
          CloseUpdateModal();
        }}
        dialogClassName="add-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Form.Group controlId="companyName">
                <Form.Control
                  value={data?.id}
                  {...register("id")}
                  type="text"
                  hidden
                />
              </Form.Group>

              <Col>
                <Form.Label>Vehicle make:</Form.Label>
                <Form.Control
                  defaultValue={data?.vehicle_make}
                  {...register("vehicle_make")}
                  type="text"
                />
              </Col>

              <Col md={4}>
                <Form.Label>Chassis no:</Form.Label>
                <Form.Control
                  defaultValue={data?.chassis_no}
                  {...register("chassis_no")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Payment:</Form.Label>
                <Form.Control as="select" {...register("payment")}>
                  <option value={data?.payment} defaultChecked>
                    {data?.payment.toUpperCase()}
                  </option>

                  {payment
                    ?.filter((item) => item?.name != data?.payment)
                    .map((el) => (
                      <option value={el?.name}>{el?.name.toUpperCase()}</option>
                    ))}
                </Form.Control>
              </Col>

              <Col>
                <Form.Label>Status:</Form.Label>
                <Form.Control as="select" {...register("vehicle_status")}>
                  <option value={data?.vehicle_status} defaultChecked>
                    {data?.vehicle_status.toUpperCase()}
                  </option>

                  {status
                    ?.filter((item) => item?.value != data?.vehicle_status)
                    .map((el) => (
                      <option value={el?.value}>{el?.name.toUpperCase()}</option>
                    ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="my-4">

            <Col>
                <Form.Label>Date of Installation:</Form.Label>
                <Form.Control
                  className="custom-date"
                  defaultValue={data?.doi}
                  {...register("doi")}
                  type="date"
                />
              </Col>

              <Col>
                <Form.Label>Insurance Renewal Date:</Form.Label>
                <Form.Control
                  className="custom-date"
                  defaultValue={data?.ird}
                  {...register("ird")}
                  type="date"
                />
              </Col>

              <Col>
                <Form.Label>Certificate Expiry Date:</Form.Label>
                <Form.Control
                  className="custom-date"
                  defaultValue={data?.certi_exp}
                  {...register("certi_exp")}
                  type="date"
                />
              </Col>

              <Col>
                <Form.Label className="my-1">Registeration Expiry Date:</Form.Label>
                <Form.Control
                  className="custom-date"
                  defaultValue={data?.reg_exp}
                  {...register("reg_exp")}
                  type="date"
                />
              </Col>

              
            </Row>

            <Row className="my-4">

            <Col>
                <Form.Label>Model no:</Form.Label>
                <Form.Control
                  defaultValue={data?.device_model}
                  {...register("device_model")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Sim Number:</Form.Label>
                <Form.Control
                  defaultValue={data?.sim_no}
                  {...register("sim_no")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>SIM Serial No:</Form.Label>
                <Form.Control
                  defaultValue={data?.sim_sno}
                  {...register("sim_sno")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>IMEI NO:</Form.Label>
                <Form.Control
                  defaultValue={data?.imei}
                  {...register("imei")}
                  type="text"
                />
              </Col>
            </Row>

            <Row className="my-4">
              <Col>
                <Form.Label>Vehicle Type:</Form.Label>
                <Form.Control as="select" {...register("vehicle_type")}>
                  <option value={data?.vehicle_type} defaultChecked>
                    {data?.vehicle_type.toUpperCase()}
                  </option>

                  {type
                    ?.filter((item) => item?.name != data?.vehicle_type)
                    .map((el) => (
                      <option value={el?.name}>{el?.name.toUpperCase()}</option>
                    ))}
                </Form.Control>
              </Col>

              <Col>
                <Form.Label>Vehicle Category:</Form.Label>
                <Form.Control
                  defaultValue={data?.vehicle_category}
                  {...register("vehicle_category")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Emirates:</Form.Label>
                <Form.Control as="select" {...register("emirates")}>
                  <option value={data?.emirates} defaultChecked>
                    {data?.emirates.toUpperCase()}
                  </option>

                  {emirates
                    ?.filter((item) => item?.name != data?.emirates)
                    .map((el) => (
                      <option value={el?.name}>{el?.name.toUpperCase()}</option>
                    ))}
                </Form.Control>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>Vehicle Color:</Form.Label>
                <Form.Control
                  defaultValue={data?.vehicle_color}
                  {...register("vehicle_color")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Vehicle Model Year:</Form.Label>
                <Form.Control
                  defaultValue={data?.vehicle_model_year}
                  {...register("vehicle_model_year")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Vehicle Plate Code:</Form.Label>
                <Form.Control
                  defaultValue={data?.plate_code}
                  {...register("plate_code")}
                  type="text"
                />
              </Col>

              <Col>
                <Form.Label>Vehicle Plate No:</Form.Label>
                <Form.Control
                  defaultValue={data?.plate_number}
                  {...register("plate_number")}
                  type="text"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
              <Form.Group>
            <Form.Control
              as="textarea"
              placeholder="remarks...."
              defaultValue={data?.remarks}
              id="floatingTextarea"
              {...register("remarks")}
            />
          
          </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              CloseUpdateModal();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(submit)}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateVehicleModal;
