import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useToasts } from 'react-toast-notifications'
import "../securepath.scss";
import { useCreatesecurepathMutation } from "../../../store/api/securepath/securepathApi";


function AddModal({ showAddModal, handleCloseAddModal,bussiness_category }) {

const { addToast } = useToasts()

 const [
    createsecurepath,
    result
]=useCreatesecurepathMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submit =async (data) => {
    handleCloseAddModal();
    reset()

    const res=await createsecurepath(data)
    if(res?.data?.status==true){
      addToast('CREATED!!', {
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


  

  return (
   <>
    <Modal
      show={showAddModal}
      onHide={handleCloseAddModal}
      dialogClassName="add-custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>SECURE PATH</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("company_name", { required: true })}
                  // placeholder="Enter company name"
                  isInvalid={errors.company_name}
                />
                <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="category">
                <Form.Label>Bussiness</Form.Label>
                <Form.Control 
                as="select"
                {...register("category")}
                >{
                  bussiness_category.map(item=><option value={item.id}>{item.name}</option>)
                }
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  invalid name
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="companyName">
                <Form.Label>Type</Form.Label>
                <Form.Control 
                as="select"
                {...register("type")}
                >
                  <option value="securepath">SECUREPATH</option>
                  <option value="locator+securepath">SECUREPATH+LOCATOR</option>
                  <option value="securepathprem">SECUREPATH PREM</option>
                  <option value="securepathprem+locator">SECUREPATH PREM+LOCATOR</option>
                  <option value="rasid">RASID</option>
                  <option value="rasid+locator">RASID+LOCATOR</option>
                  <option value="shahin">SHAHIN</option>
                  <option value="shahin+locator">SHAHIN+LOCATOR</option>
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
                  <option value="active">ACTIVE</option>
                  <option value="blocked">BLOCKED</option>
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
            />
            <Form.Control.Feedback type="invalid">
              required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="textarea"
              placeholder="remarks...."
              id="floatingTextarea"
              {...register("remarks")}
              // isInvalid={errors.address}
            />
          
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{
            handleCloseAddModal()
            reset()
            }}>
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

export default AddModal;
