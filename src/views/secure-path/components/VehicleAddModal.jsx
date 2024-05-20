import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import "../securevehicle.scss"
import { useForm } from "react-hook-form";
import {useCreatevehiclesMutation} from "../../../store/api/securepath/securepathApi";
import { useToasts } from 'react-toast-notifications'

function VehicleAddModal({ ShowAddModal, CloseAddModal, data={} ,company}) {
    const { addToast } = useToasts()
    const [createvehicles]=useCreatevehiclesMutation()
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();
    
      const submit = async(data) => {
        reset()
        CloseAddModal()
        const res=await createvehicles(data)
        if(res?.data?.status==true){
          addToast('New Entry Created!', {
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
    
      let status= [
        // {
        //   value: "active",
        //   name: "ACTIVE",
        // },
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
    
      let  payment= [
        {
          value:"paid",
          name: "PAID",
        },
      ];
      
      let emirates= [           
        {
          value: 'Abu Dhabi',
          name:  'Abu Dhabi',
        },
        // {
        //   value:'Dubai',
        //   name: 'Dubai',
        // },
        {
          value:'Sharjah',
          name: 'Sharjah',
        },
        {
          value:'Ajman',
          name: 'Ajman',
        },
        {
          value:'Umm Al Quwain',
          name: 'Umm Al Quwain',
        },
        {
          value:'Ras Al Khaimah',
          name: 'Ras Al Khaimah',
        },
        {
          value:'Fujairah',
          name: 'Fujairah',
        },
      ]
      let type=[ 
        {
          value:'securepath premium',
          name: 'securepath premium',
        },
        // {
        //   value:'securepath',
        //   name: 'securepath',
        // },
        {
          value:'shahin',
          name: 'shahin',
        },
      ]
  return (
    <>
     <Modal
        show={ShowAddModal}
        onHide={() => {
          CloseAddModal();
          reset()
        }}
        dialogClassName="add-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>ADD VEHICLE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="px-3 pb-2">
            <Form.Label>COMPANY:</Form.Label>
              <Form.Control as="select" 
               isInvalid={errors.securePathId}
               {...register('securePathId',{required:true})}
               >
                    {company
                      .map((el) => (
                        <option value={el?.id}>{el?.company_name.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Row>
            <Row>

              <Col>
                <Form.Label>Vehicle make:</Form.Label>
                <Form.Control
                   {...register('vehicle_make',{required:true})}
                  isInvalid={errors.vehicle_make}
                  type="text"
                />
                 <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
              </Col>


              <Col md={4}>
              <Form.Label>Chassis no:</Form.Label>
                  <Form.Control
                   {...register('chassis_no',{required:true})}
                    isInvalid={errors.chassis_no}
                    type="text"
                  />
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
              </Col>

              <Col>
              <Form.Label>Payment:</Form.Label>
              <Form.Control as="select"  isInvalid={errors.payment}   {...register('payment',{
                    required: "Please select a payment",
                  })} >
                    <option value='not paid' defaultChecked>
                      NOT PAID
                    </option>

                    {payment?.filter((item) => item?.name!= data?.payment)
                      .map((el) => (
                        <option value={el?.name}>{el?.name.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
              </Col>

              <Col>
              <Form.Group controlId="status">
              <Form.Label>Status:</Form.Label>
              <Form.Control as="select" isInvalid={errors.vehicle_status}  {...register('vehicle_status',{
                    required: "Please select a status",
                  })}>
                    <option value='active' defaultChecked>
                      ACTIVE
                    </option>

                    {status?.filter((item) => item?.name!= data?.vehicle_status)
                      .map((el) => (
                        <option value={el?.name}>{el?.name.toUpperCase()}</option>
                      ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Form.Group>
              </Col>



            </Row>

            <Row className="my-4">
            <Col>
                <Form.Label>Date of Installation:</Form.Label>
                <Form.Control
                className="custom-date"
                // defaultValue={new Date()}
                  type="date"
                  {...register('doi',{required:true})}
                  isInvalid={errors.doi}
                /> 
                <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>

                <Col>
                <Form.Label>Insurance Renewal Date:</Form.Label>
                <Form.Control
                // value='20/05/2024'
                className="custom-date"
                {...register('ird',{required:true})}
                  isInvalid={errors.ird}
                  type="date"
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>
                
                <Col>
                <Form.Label>Certificate Expiry Date:</Form.Label>
                <Form.Control
                className="custom-date"
                {...register('certi_exp',{required:true})}
                  type="date"
                  isInvalid={errors.vehicle_status}
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>
{" "}
                <Col>
                <Form.Label className="my-1">Registeration Expiry Date:</Form.Label>
                <Form.Control
                className="custom-date"
                // defaultValue={`20/05/2024`}
                {...register('reg_exp',{required:true})}
                  type="date"
                  isInvalid={errors.reg_exp}
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>

               
            </Row>

            <Row className="my-4">
            <Col>
              <Form.Label>Model no:</Form.Label>
                  <Form.Control  
                    type="text"
                    isInvalid={errors.device_model}
                    {...register('device_model',{required:true})}
                  />
                   <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
              </Col>

            <Col>
                <Form.Label>Sim Number:</Form.Label>
                <Form.Control
                   {...register('sim_no',{required:true})}
                   isInvalid={errors.sim_no}
                  type="text"
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>

            <Col>
                <Form.Label>SIM Serial No:</Form.Label>
                <Form.Control
                  {...register('sim_sno',{required:true})}
                  isInvalid={errors.sim_sno}
                  type="text"
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>

            <Col>
                <Form.Label>IMEI NO:</Form.Label>
                <Form.Control
                 {...register('imei',{required:true})}
                 isInvalid={errors.imei}
                  type="text"
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>

            </Row>

            <Row className="my-4">

            <Col>
                <Form.Label>Vehicle Type:</Form.Label>
                <Form.Control as="select" 
                {...register('vehicle_type',{required:true})}
                isInvalid={errors.vehicle_type}
                >
                    <option value='securepath' defaultChecked>
                      SECUREPATH
                    </option>

                    {type?.filter((item) => item?.name!= data?.vehicle_type)
                      .map((el) => (
                        <option value={el?.name}>{el?.name.toUpperCase()}</option>
                      ))}
                  </Form.Control> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>

            <Col>
                <Form.Label>Vehicle Category:</Form.Label>
                <Form.Control
                 {...register('vehicle_category',{required:true})}
                 isInvalid={errors.vehicle_category}
                  type="text"
                /> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>
            
            <Col>
                <Form.Label>Emirates:</Form.Label>
                <Form.Control as="select"
                
                {...register('emirates',{required:true})}
                isInvalid={errors.emirates}
                >
                    <option value='Dubai' defaultChecked>
                      DUBAI
                    </option>

                    {emirates?.filter((item) => item?.name!= data?.emirates)
                      .map((el) => (
                        <option value={el?.name}>{el?.name.toUpperCase()}</option>
                      ))}
                  </Form.Control> 
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
            </Col>

            </Row>

            <Row>
                <Col>
                <Form.Label>Vehicle Color:</Form.Label>
                <Form.Control
                  type="text"
                  {...register('vehicle_color',{required:true})}
                  isInvalid={errors.vehicle_color}
                />    
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>

                <Col>
                <Form.Label>Vehicle Model Year:</Form.Label>
                <Form.Control
                
                  {...register('vehicle_model_year',{required:true})}
                  isInvalid={errors.vehicle_model_year}
                  type="text"
                />    
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>

                <Col>
                <Form.Label>Vehicle Plate Code:</Form.Label>
                <Form.Control
          
                  {...register('plate_code',{required:true})}
                  isInvalid={errors.plate_code}

                  type="text"
                />    
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>

                <Col>
                <Form.Label>Vehicle Plate No:</Form.Label>
                <Form.Control
                  {...register('plate_number',{required:true})}
                  isInvalid={errors.plate_number}
                  type="text"
                />    
                  <Form.Control.Feedback type="invalid">
                  required
                </Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="mt-2">
              <Col>
              <Form.Group>
            <Form.Control
              as="textarea"
              placeholder="remarks...."
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
              CloseAddModal();
              reset()
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
  )
}

export default VehicleAddModal