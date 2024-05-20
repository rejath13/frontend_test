import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import "../securepath.scss";
import { useForm } from "react-hook-form";
import {useUpdatesecurepathMutation} from "../../../store/api/securepath/securepathApi";
import { useToasts } from 'react-toast-notifications'

function UpdateModal({
  showUpdateModal,
  handleCloseUpdateModal,
  UpdateFields,
  bussiness_category,
}) {

  const { addToast } = useToasts()
  const [updatesecurepath]=useUpdatesecurepathMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit = async(data) =>  { 
    handleCloseUpdateModal();
    UpdateFields.current = {};
    reset();

    const res=await updatesecurepath(data)
    if(res?.data?.status==true){
      addToast('UPDATED!!', {
        appearance: 'success',
        autoDismiss: true,
      })
     }
     else{
      addToast('Something Went Wrong!', {
        appearance:'error',
        autoDismiss: true,
      })
     }
  };

  let category = bussiness_category;

  let type = [
    {
      value: "securepath",
      name: "securepath",
    },
    {
      value: "locator+securepath",
      name: "locator+securepath",
    },
    {
      value: "securepathprem",
      name: "securepathprem",
    },
    {
      value: "securepathprem+locator",
      name: "securepathprem+locator",
    },
    {
      value: "rasid",
      name: "rasid",
    },
    {
      value: "rasid+locator",
      name: "rasid+locator",
    },
    {
      value: "shahin",
      name: "shahin",
    },
    {
      value: "shahin+locator",
      name: "shahin+locator",
    },
  ];

  let status = [
    {
      value: "active",
      name: "active",
    },
    {
      value: "blocked",
      name: "blocked",
    },
  ];

  return (
    <>
      <Modal
        show={showUpdateModal}
        onHide={() => {
          handleCloseUpdateModal();
          UpdateFields.current = {};
          reset();
        }}
        dialogClassName="add-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="companyName">
                  <Form.Control
                    value={UpdateFields.current.company_name}
                    {...register("company_name")}
                    type="text"
                    hidden
                  />

                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    value={UpdateFields.current.company_name}
                    disabled={true}
                    type="text"
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="category">
                  <Form.Label>Bussiness</Form.Label>
                  <Form.Control as="select" {...register("category")}>
                    <option
                      value={UpdateFields.current.bussiness_category?.id}
                      defaultChecked
                    >
                      {`${UpdateFields.current.bussiness_category?.name}`.toUpperCase()}
                    </option>

                    {category
                      .filter(
                        (item) =>
                          item.name !=
                          UpdateFields.current.bussiness_category?.name
                      )
                      .map((el) => (
                        <option value={el?.id}>{el?.name.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    invalid name
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="companyName">
                  <Form.Label>Type</Form.Label>
                  <Form.Control as="select" {...register("type")}>
                    <option value={UpdateFields.current?.type} defaultChecked>
                      {UpdateFields?.current?.type?.toUpperCase()}
                    </option>

                    {type
                      .filter((item) => item.name != UpdateFields.current.type)
                      .map((el) => (
                        <option value={el?.id}>{el?.name?.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="companyName">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    {...register("status", {
                      required: "Please select a status",
                    })}
                    isInvalid={errors.status}
                  >
                    <option
                      value={UpdateFields.current.status}
                      defaultChecked={true}
                    >
                      {UpdateFields?.current?.status?.toUpperCase()}
                    </option>
                    {status
                      .filter(
                        (item) => item.name != UpdateFields.current?.status
                      )
                      .map((el) => (
                        <option value={el?.id}>{el?.name?.toUpperCase()}</option>
                      ))}
                    {/* <option value="active">active</option>
                  <option value="blocked">blocked</option> */}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>License No</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("trade_license", { required: true })}
                    isInvalid={errors.trade_license}
                    defaultValue={UpdateFields.current.trade_license_no}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>File No</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("file_no", { required: true })}
                    defaultValue={UpdateFields.current.traffic_file_no}
                    isInvalid={errors.file_no}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("owner_name", { required: true })}
                    defaultValue={UpdateFields.current.company_owner_name}
                    isInvalid={errors.owner_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("email", { required: true })}
                    defaultValue={UpdateFields.current.email}
                    isInvalid={errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("phone", { required: true })}
                    defaultValue={UpdateFields.current.phone}
                    isInvalid={errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="license">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("zip_code")}
                    defaultValue={UpdateFields.current.zip_code}
                    isInvalid={errors.zip_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    required
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="address..."
                id="floatingTextarea"
                {...register("address", { required: true })}
                isInvalid={errors.address}
                defaultValue={UpdateFields.current.address}
              />
              <Form.Control.Feedback type="invalid">
                required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="remarks..."
                id="floatingTextarea"
                {...register("remarks")}
                defaultValue={UpdateFields.current.remarks==='no remarks'?"":
                UpdateFields.current.remarks
                }
              />
            
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseUpdateModal();
              UpdateFields.current = {};
              reset();
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

export default UpdateModal;
