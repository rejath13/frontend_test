
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


function Table({ columns, data, gettechlist,addtechs }) {
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
     
        gettechlist({  })
     
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
    const [techeditPopup, settecheditPopup] = useState(false);   
    const [selectedtechId, setselectedtechid] = useState(0);
    const [activeColor, setactiveColor] = useState('#267E92');
    const [visible, setvisibility] = useState(false);
    const [stockPopup, setstockPopup] = useState(false); 
    const [stockDate, setstockDate] = useState();
    const [stockdata, setstockdata] = useState([]);
    const [items, setitems] = useState([]);
     const calladdtechs = () =>{
        addtechs();
      }

    const handlestockDateChange = (date) =>{
        setstockDate(new Date(date)); 
        resetShareDetails({...getShareValues(), date: new Date(date),stock_out_date: new Date(date)});  
                                  
    }  
    const { register, handleSubmit, reset ,getValues} = useForm({
           defaultValues: {
                      technician_color: '',
                      technician_company_name: '',
                      technician_email: '',
                      technician_name:'',
                      technician_phone:'',
                      technician_address: '',
                      technician_password: '',
                      technician_id:'',                                
      },
    });


    const { register: registerShare,
     handleSubmit: handleShareDetailsSubmit,
      reset: resetShareDetails, 
      getValues: getShareValues } 
      = useForm({
         defaultValues1: {
                      date: new Date(),
                      stock_out_date: new Date(),
                      stock_out_job_id: '',
                      stock_out_quantity: '',
                      stock_out_technician_id:'',
                      stock_out_technician_name:'',
                      stock_out_type_id: '',
                                             
      },
      });

    


   const addtechs = () => {
    setselectedtechid(0); 
    settecheditPopup(true); 
      reset({
                      technician_color: '',
                      technician_company_name: '',
                      technician_email: '',
                      technician_name:'',
                      technician_phone:'',
                      technician_address: '',
                      technician_password: '',
                      technician_id:'',           
     });  
  }


 const savestockout = async (data) => {

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
          
       

          const url = API_URL+"addstockout";

          const response = await fetch(url, options)
          
          const data1 = await response.json();

          if(data1.status === 'success')            
           sweetAlertHandler({title: 'Good job!', type: 'success', text: 'Successfully added  !'})
          else
            sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in adding  !'})          
    }
    catch
    {
             sweetAlertHandler({title: 'Error!', type: 'error', text: 'Error in adding  !'})
    } 

}
    const edittechform = async (data) => {

    if(data.technician_id!=''){ 

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
          
       

          const url = API_URL+"edittechnician/"+data.technician_id;

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
          
       

          const url = API_URL+"addtechnician";

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

const fnstockout = async (techid) => {

  
                setIsLoading(true);
          
                setstockDate(new Date()); 
                 const options = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    }
                }

                const url = API_URL + "singletechnician/"+techid ;

                const response = await fetch(url, options)

                const techdata = await response.json();


                 const options2 = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    }
                }

                const url2 = API_URL + "items" ;

                const response2 = await fetch(url2, options2)

                const items = await response2.json();
                setitems(items.data);
                 resetShareDetails({
                          date: new Date(),
                          stock_out_job_id: 185,
                          stock_out_quantity: '',
                          stock_out_technician_id:techdata.data[0].technician_id,
                          stock_out_technician_name:techdata.data[0].technician_name,
                          stock_out_type_id: '',
                          stock_out_date:new Date()
                                           
                 });  

                const options1 = {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Xtoken': authToken
                    }
                }

                const url1 = API_URL + "stockoutlist/"+techid ;

                const response1 = await fetch(url1, options1)

                const techstockdata = await response1.json();
               
                setstockdata(techstockdata.data);
         
                setstockPopup(true);

                setIsLoading(true);
}

 const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );
const edittechs = async (techid) => {
                setvisibility(false);

                try {
                const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url = API_URL + "singletechnician/"+techid ;

                const response = await fetch(url, options)

                const techdata = await response.json();


                 
                setselectedtechid(techid); 
                settecheditPopup(true); 
                  reset({
                                  technician_color: techdata.data[0].technician_color,
                                  technician_company_name: techdata.data[0].technician_company_name,
                                  technician_email: techdata.data[0].technician_email,
                                  technician_name:techdata.data[0].technician_name,
                                  technician_phone:techdata.data[0].technician_phone,
                                  technician_address: techdata.data[0].technician_address,
                                  technician_password: '',
                                  technician_id:techdata.data[0].technician_id,           
                 });  
                }
                catch {

                }

                 settecheditPopup(true);          
    }

const colorpicker=()=>{
  if(visible==false)
    setvisibility(true);
  else
     setvisibility(false);
}

  const handleChangeComplete = (color) => {
     setactiveColor(color.hex)
     reset({...getValues(),technician_color:color.hex}); 
  };


  const deleteTech  = async (id) => {


      try{
        const options = { 
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }   
            
        const url = API_URL+"deletetechnician/"+id;

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
        accessor: 'technician_name',
      },
      {
        Header: 'Company Name',
        accessor: 'technician_company_name',
      },
      {
        Header: 'Phone',
        accessor: 'technician_phone',
      },
      {
        Header: '   Email',
        accessor: 'technician_email',
      },
      {
        Header: '   Color',
        accessor: 'technician_color',
      },
      {
        Header: '',
        accessor: 'technician_id',
        Cell: ({ cell }) => {
          const { value } = cell;
          return(
            <span>
             <OverlayTrigger 
                                  placement='top'
                                  overlay={<Tooltip id={`tooltip-top`}>Stock Out</Tooltip>}>
                                  <span>
                                  <Button onClick={()=>fnstockout(value)}><i class="fab fa-accusoft"></i></Button></span>
              </OverlayTrigger>
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

  const gettechlist = useCallback(async ({  })  => {

    try{
      const options = { 
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }    

          
      const url = API_URL+"technicians";

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
                          <Card.Title as="h5">TECHNICIAN TABLE</Card.Title>
                          <Button variant="info" style={{float:'right'}} onClick={()=>calladdtechs()}>Add Techs</Button> 
                      </Card.Header>
                      <Card.Body>
                          <Table columns={columns} data={data} gettechlist={gettechlist}/>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>


          <Modal size="xl" show={stockPopup} onHide={() => setstockPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Stock Out</Modal.Title>
                </Modal.Header>
                 <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                       <Form key="stockform" onSubmit={handleShareDetailsSubmit(savestockout)} >
                            <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Date :</Form.Label>

                                      <DatePicker
                                                    placeholderText='Select date'
                                                    selected={stockDate}
                                                    onChange={handlestockDateChange}
                                                    className="form-control"   
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy"
                                                    timeCaption="time"
                                                    isClearable={true}
                                                />

                                   
                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Technician: *</Form.Label>
                                    <input type="text" disabled class="form-control" {...registerShare('stock_out_technician_name')}/>

                                </Form.Group>
                            </Col>
                            </Row>
                             <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Type: </Form.Label>
                                        <select
                                      
                                        name="Technician"
                                        as="select"
                                        className="form-control"
                                        {...registerShare('stock_out_type_id')} 
                                    >
                            <option value="None"></option>
                                        {items &&
                                            items.map(item => (
                            <option  key={item.item_id} value={item.item_id}>
                                                    {item.item_type}
                                                </option>
                                            ))}
                                    </select>
                                    

                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Quantity: *</Form.Label>

                                    <input type="text" class="form-control"  {...registerShare('stock_out_quantity')}  />

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
                       
                       <Tabs defaultActiveKey="schedule">
                            <Tab eventKey="schedule" title="">  
                      <BTable responsive style={{border:'1px solid #eaeaea',borderTop:'none'}}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Technician Name</th>
                        <th>Quantity</th>
                        <th>Type</th>
                        </tr>
                    </thead>
                      <tbody>
                    {stockdata.map((item, index) => (
                      <tr>
                      <td>{Moment(item.stock_out_date).format('DD-MM-yyyy')}</td>
                      <td>{item.technician_name}</td>
                      <td>{item.stock_out_quantity}</td>
                      <td>{item.item_name}</td>
                      
                      </tr>
                    ))}

                     {stockdata.length == 0 ?<tr><td colspan="4">No Stock out by this Job</td></tr> :''}
                     </tbody>         
                  </BTable>                                                     
                         </Tab>
                        </Tabs>
  

                    </Col>
                </Row>                                           
                        
                 
               
                 
               
                </Modal.Body>
            </Modal>


            <Modal size="xl" show={techeditPopup} onHide={() => settecheditPopup(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{selectedtechId?'Edit Technician':'Add Technician'}</Modal.Title>
                </Modal.Header>
                 <Modal.Body style={{ padding: 0 }}>
                    <Row>
                        <Col md={12}>
                            <Card style={{ margin: 0 }}>
                                <Card.Body className='task-comment'>

                       <Form key="vehicleform" onSubmit={handleSubmit(edittechform)} >
                            <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Name :</Form.Label>

                                     <input type="text" class="form-control"   {...register('technician_name')} />

                                   
                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Company Name: *</Form.Label>
                                    <input type="text" class="form-control"  {...register('technician_company_name')} />

                                </Form.Group>
                            </Col>
                            </Row>
                             <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Phone: </Form.Label>

                                     <input type="text" class="form-control"  {...register('technician_phone')} />

                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Email: *</Form.Label>

                                    <input type="text" class="form-control"  {...register('technician_email')}  />

                                </Form.Group>
                            </Col>
                            </Row>
                             <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Address: </Form.Label>

                                     <input type="text" class="form-control"  {...register('technician_address')} />

                                </Form.Group>
                            </Col>
                          <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Password: *</Form.Label>

                                    <input type="text" class="form-control"  {...register('technician_password')}  />

                                </Form.Group>
                            </Col>
                            </Row>
                              <Row>
                           <Col md={6}>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Color: </Form.Label>
                                  <input type="text" class="form-control"  {...register('technician_color')} onClick={()=>colorpicker()} />
                                  
                                 {visible && (<SketchPicker  color={activeColor} 
                                    onChangeComplete={ (e)=>handleChangeComplete(e)}
                                  />)
                                }

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