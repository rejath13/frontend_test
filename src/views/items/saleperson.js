
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Button, Alert,Form,Modal,Tabs,Tab , OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useForm } from "react-hook-form";
import BTable from 'react-bootstrap/Table';
import { useTable } from 'react-table'
import {  API_URL } from "../../config/constant";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { SketchPicker } from 'react-color';
import DatePicker from "react-datepicker";
import Moment from 'moment';
const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        //title: alert.title,
        icon: 'success',
        text: alert.text,
        type: alert.type
    });
};


function Table({ columns, data, getpersonlist,addperson }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  useEffect(() => {
     
        getpersonlist({  })
     
  }, [])

  // Render the UI for your table
  return (
    <BTable striped bordered hover responsive {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortType, setSortType] = useState('tbl_customer.customer_expiry_date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [personeditPopup, setpersoneditPopup] = useState(false);   
    const [selectedpersonId, setselectedpersonid] = useState(0);
     const calladdsalesperson = () =>{
        addperson();
      }

 
    const { register, handleSubmit, reset ,getValues} = useForm({
           defaultValues: {
                      sales_person_company_name: '',
                      sales_person_email: '',
                      sales_person_name:'',
                      sales_person_phone:'',
                      sales_person_address: '',
                      sales_person_password: '',
                      sales_person_id:'',                                
      },
    });


   const addperson = () => {
    setselectedpersonid(0); 
    setpersoneditPopup(true); 
      reset({
                     sales_person_company_name: '',
                      sales_person_email: '',
                      sales_person_name:'',
                      sales_person_phone:'',
                      sales_person_address: '',
                      sales_person_id:'', 
                      sales_person_password: '',        
     });  
  }



    const editpersonform = async (data) => {

    if(data.sales_person_id!=''){ 

    try{
          const options = { 
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Xtoken': authToken
            },
            body: JSON.stringify(data),
          };   
          
       

          const url = API_URL+"editsalesperson/"+data.sales_person_id;

          const response = await fetch(url, options)
          
          const data1 = await response.json();

          if(data1.status === 'success')            
           sweetAlertHandler({title: 'Good job!', type: 'success', text: 'Successfully edited  !'})
          else
            sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in editing  !'})          
    }
    catch
    {
             sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in editing  !'})
    } 

  }
  else
   {

    try{
          const options = { 
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Xtoken': authToken
            },
            body: JSON.stringify(data),
          };   
          
       

          const url = API_URL+"addsalesperson";

          const response = await fetch(url, options)
          
          const data1 = await response.json();

          if(data1.status === 'success')            
            sweetAlertHandler({title: 'Good job!', type: 'success', text: 'Successfully Added  !'})
            
          else
            sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in Added  !'})          
    }
    catch
    {
             sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in Added  !'})
    } 
    
   } 
    setListUpdated(true);
}



 const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );
const edittechs = async (personid) => {
               

                try {
                const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url = API_URL + "singlesalesperson/"+personid ;

                const response = await fetch(url, options)

                const persondata = await response.json();


                 
                setselectedpersonid(personid); 
                setpersoneditPopup(true); 
                  reset({
                                  sales_person_company_name: persondata.data[0].sales_person_company_name,
                                  sales_person_email: persondata.data[0].sales_person_email,
                                  sales_person_name:persondata.data[0].sales_person_name,
                                  sales_person_phone:persondata.data[0].sales_person_phone,
                                  sales_person_address: persondata.data[0].sales_person_address,
                                  sales_person_password:'',
                                  sales_person_id:persondata.data[0].sales_person_id,       
                                           
                 });  
                }
                catch {

                }

                         
    }




  const deleteTech  = async (id) => {


      try{
        const options = { 
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }   
            
        const url = API_URL+"deletesalesperson/"+id;

        const response = await fetch(url, options)
        
        const data = await response.json();
        if(data.status==='success')
           sweetAlertHandler({title: 'Good job!', type: 'success', text: 'Successfully Deleted  !'})
         setListUpdated(true);
      }
      catch{

      }
    
  }

  const columns = React.useMemo(
    () => [
       {
        Header: 'Name',
        accessor: 'sales_person_name',
      },
      {
        Header: 'Company Name',
        accessor: 'sales_person_company_name',
      },
      {
        Header: 'Phone',
        accessor: 'sales_person_phone',
      },
      {
        Header: '   Email',
        accessor: 'sales_person_email',
      },
      {
        Header: '',
        accessor: 'sales_person_id',
        Cell: ({ cell }) => {
          const { value } = cell;
          return(
            <span>
             
            <Button variant="warning" onClick={()=>edittechs(value)}>Edit</Button>
            <Button variant="danger" onClick={() => {
              const confirmBox = window.confirm(
                "Are you sure you want to delete this item?"
              )
              if (confirmBox === true) {
                deleteTech(value)
              }
            }}>Delete</Button></span>
          ) 
          
        }
      },
      
    ],
    []
  )

  const [data, setdata] = useState([]);

  const getpersonlist = useCallback(async ({  })  => {

    try{
      const options = { 
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }    

          
      const url = API_URL+"salesperson";

      const response = await fetch(url, options)
      
      const data = await response.json();
      
      setdata(data.data);
    }
    catch{

    }

  }, []);
  return (
        <React.Fragment>
          <Row>
              <Col>
                  <Card>
                      <Card.Header>
                          <Card.Title as="h5">SALES PERSON'S TABLE</Card.Title>
                          <Button variant="info" style={{float:'right'}} onClick={()=>calladdsalesperson()}>Add Techs</Button> 
                      </Card.Header>
                      <Card.Body>
                          <Table columns={columns} data={data} getpersonlist={getpersonlist}/>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>


         


            <Modal size="xl" show={personeditPopup} onHide={() => setpersoneditPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedpersonId?'Edit Sales Person':'Add Sales Person'}</Modal.Title>
                </Modal.Header>
                 <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                       <Form key="vehicleform" onSubmit={handleSubmit(editpersonform)} >
                            <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Name :</Form.Label>

                                     <input type="text" class="form-control"   {...register('sales_person_name')} />

                                   
                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Company Name: *</Form.Label>
                                    <input type="text" class="form-control"  {...register('sales_person_company_name')} />

                                </Form.Group>
                            </Col>
                            </Row>
                             <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Phone: </Form.Label>

                                     <input type="text" class="form-control"  {...register('sales_person_phone')} />

                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Email: *</Form.Label>

                                    <input type="text" class="form-control"  {...register('sales_person_email')}  />

                                </Form.Group>
                            </Col>
                            </Row>
                             <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Address: </Form.Label>

                                     <input type="text" class="form-control"  {...register('sales_person_address')} />

                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Password: *</Form.Label>

                                    <input type="text" class="form-control"  {...register('technician_password')}  />

                                </Form.Group>
                            </Col>
                            </Row>
                          
                            
                           

                             

                           
                             <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Save</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                 <Row>
                     <Col md={12}> 
                     &nbsp; 
                     </Col>
                </Row> 
               
                </Modal.Body>

            </Modal>
        </React.Fragment>
  )
}

export default App