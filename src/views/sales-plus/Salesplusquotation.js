import React, { useState, useCallback, useEffect } from 'react';

import { Row, Col, Button, Form,Modal,Table,Card, Tabs, Tab } from 'react-bootstrap';

import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

import Select from 'react-select';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './saleplus.css';

import Editor from "nib-core";

function Salesplusquotation({salesId}) {

const authToken = localStorage.getItem('authToken');
const [salespersonList, setsalepersonList] = useState([]);
const [lastDealPopup, setlastDealPopup] = useState(null);
const [lastDealdata, getlastDealdata] = useState([]);
const [choosenDate, setchoosenDate] = useState(new Date());  
const [quoteitemList, setquoteList] = useState([]);
const [salesquoteList, setsalesquoteList] = useState([]);
const [salesplusList, setsalesplusList] = useState([]);
const [optional, setoptional] = useState(0);
const [plusoption, setplusoption] = useState(0);
const [optionvalue, setcuroption] = useState(1);
const [discount1, setdiscount1] = useState(0);
const [discount2, setdiscount2] = useState(0);
const [emailtext_content, setContent] = useState(null);
const [pay_option, setpay_option] = useState(null);
var slno=1;
var totalamount=0;
var amount=0; 

const {
        register: register,
        handleSubmit: handleSubmit,
        reset: reset,getValues: getValues
       } = useForm({
          defaultValues: {

                quotation_customer_id:salesId,
                quotation_item :null,
                quotation_item_description :null,
                quotation_option_number :1,
                quotation_prize :0,
                quotation_quantity  :0,
                quotation_vat   :5,
                quotation_optional   :0,
                quotation_id:0,
                sales_plus_email: null,
                sales_quotation_email_subject   :null,
                sales_quotation_email_content   :null,
                sales_payment_option    :null,
                sales_quotation_option1_remark  : null,
                sales_quotation_option2_remark  : null,
                sales_quotation_option1_heading : null,
                sales_quotation_option2_heading : null,
                sales_quotation_option1_discount    :null,
                sales_quotation_option2_discount    :null,
                 
        }          
    });




const fnoptionval = e => {
        var option=e.target.value;
         reset({...getValues(),
                      quotation_option_number: option
            });
         setcuroption(option);

}
var email_content=getValues('sales_quotation_email_content');
var payoption=getValues('sales_payment_option');

if(email_content===null )
{
       email_content ={
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: ".zxc"
                    }
                ]
            }
        ]
    };
    
}
else
{
    email_content = JSON.parse(getValues('sales_quotation_email_content'));
}
 
// if(payoption==null )
// {
//        payoption = {
//         type: "doc",
//         content: [
//             {
//                 type: "paragraph",
//                 content: [
//                     {
//                         type: "text",
//                         text: ".zxc"
//                     }
//                 ]
//             }
//         ]
//     };
    
// }
// else
// {
//      payoption = JSON.parse(getValues('sales_payment_option'));
// }

const savequoteitem = async (quoteitem) => {

         const postdata = {  quotation_customer_id: quoteitem.quotation_customer_id,
             quotation_item:quoteitem.quotation_item,
             quotation_item_description: quoteitem.quotation_item_description,
             quotation_option_number:optionvalue,
             quotation_optional:quoteitem.quotation_optional,
             quotation_prize:quoteitem.quotation_prize,
             quotation_quantity:quoteitem.quotation_quantity,
             quotation_vat:quoteitem.quotation_vat,
             quotation_id:quoteitem.quotation_id };

        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata),
            };

            if(quoteitem.quotation_id!=0 )
                var url = API_URL + "editQuotation/"+quoteitem.quotation_id;
            else
                var url = API_URL + "addQuotation";
            

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

               sweetAlertHandler({ title: 'Good job!', type: 'success', text: data.data });
               getquotationdata(salesId);
               resetquotedata();

            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating Items!' })
            }
            
            
        }
        catch {

        }
}


 const resetquotedata = () => {  

              reset({
                quotation_customer_id:salesId,
                quotation_item :null,
                quotation_item_description :null,
                quotation_option_number :optionvalue,
                quotation_prize :0,
                quotation_quantity  :0,
                quotation_vat   :5,
                quotation_optional   :0,
                quotation_id:0
            });      
          
    };

const addoption =() =>{
    setplusoption(1);
} 


 const previewQuotes =async() =>{
     quotationaction('preview');
 }
 const saveQuotes =async() =>{
     quotationaction('print');
 }

 const quotationaction =async(type) =>{

     var content_text = JSON.stringify(emailtext_content); 
     var option_comment = JSON.stringify(pay_option); 
     const postdata = {  
            customer_id:salesplusList.sales_plus_id,
            sales_plus_person:salesplusList.user_id ,
            sales_plus_date:salesplusList.sales_plus_date,
            sales_plus_company_name:salesplusList.sales_plus_company_name,
            sales_plus_customer_name:salesplusList.sales_plus_customer_name,
            sales_quotation_quantity:salesplusList.sales_quotation_quantity,
            sales_quotation_option1_discount:getValues('sales_quotation_option1_discount'),
            sales_quotation_option1_heading:getValues('sales_quotation_option1_heading'),
            sales_quotation_option1_remark:getValues('sales_quotation_option1_remark'),
            sales_quotation_option2_discount:getValues('sales_quotation_option2_discount'),
            sales_quotation_option2_heading:getValues('sales_quotation_option2_heading'),
            sales_quotation_option2_remark:getValues('sales_quotation_option2_remark'),
            sales_plus_email:getValues('sales_plus_email'),
            sales_quotation_email_subject:getValues('sales_quotation_email_subject'),
            sales_payment_option:option_comment,
            sales_quotation_email_content:content_text,
            pdf:type,
     };


        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata),
            };

           var url = API_URL + "quotation";
            

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

               sweetAlertHandler({ title: 'Good job!', type: 'success', text: data.data });
            } 
            else 
            {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating Items!' })
            }
            
            
        }
        catch {

        }



 }   
 const editsaleplusitem =async  (id) =>{
        const options1 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url = API_URL + "getsingleQuotation/"+id;

                const response = await fetch(url, options1)

                const itemdata = await response.json();
                 reset({
                        quotation_customer_id:itemdata.data.quotation_customer_id,
                        quotation_item :itemdata.data.quotation_item,
                        quotation_item_description :itemdata.data.quotation_item_description,
                        quotation_option_number :itemdata.data.quotation_option_number,
                        quotation_prize :itemdata.data.quotation_prize,
                        quotation_quantity  :itemdata.data.quotation_quantity,
                        quotation_vat   :itemdata.data.quotation_vat,
                        quotation_optional   :itemdata.data.quotation_optional,
                        quotation_id:itemdata.data.quotation_id,
            });  
            setcuroption(itemdata.data.quotation_option_number);     
            setoptional(itemdata.data.quotation_optional);     
                 
    }

     const deletesaleplusitem =async  (id) =>{


            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            };

           
            var url = API_URL + "deleteQuotation/"+id;
            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {
                sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully Deleted!' })
                getquotationdata(salesId);
            } else {
                sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in deleting!' })
            }
            
    }
    const fnitemcode = e => {
    var option=e.target.value;
    var item=quoteitemList.filter(item => item.quotation_item_title == option);

    reset({...getValues(),                     
                        quotation_item :item[0].quotation_item_title,
                        quotation_item_description :item[0].quotation_item_description,
        });  
    
}


  const fndiscount1 = e => {
    var discount1=e.target.value;
    
    reset({...getValues(),                     
                        sales_quotation_option1_discount :discount1});
    setdiscount1(discount1);      
}

  const fndiscount2 = e => {
    var discount2=e.target.value;
    reset({...getValues(),                     
                        sales_quotation_option2_discount :discount2});
    setdiscount2(discount2);      
}




const fnoptional =async (e) => {
      var checked = e.target.checked;
    
    if (checked) {
        reset({...getValues(),
                      quotation_optional: 1
            });
        

    } else {
       reset({...getValues(),
                      quotation_optional: 0
            });
       
    }
     
}




const getquotationdata = async (id) =>{ 
  
const options1 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url = API_URL + "singlesalesplus/"+id;

                const response = await fetch(url, options1)

                const salesplusdata = await response.json();
                setsalesplusList(salesplusdata.data[0]); 
                if(salesplusdata.data[0].sales_quotation_option2_discount!=null)
                        setplusoption(1);
                
                reset({...getValues(), quotation_customer_id:salesplusdata.data[0].sales_plus_id ,
                    sales_plus_email: salesplusdata.data[0].sales_plus_email,
                sales_quotation_email_subject   : salesplusdata.data[0].sales_quotation_email_subject,
                sales_quotation_email_content   : salesplusdata.data[0].sales_quotation_email_content,
                sales_payment_option    : salesplusdata.data[0].sales_payment_option,
                sales_quotation_option1_remark  : salesplusdata.data[0].sales_quotation_option1_remark,
                sales_quotation_option2_remark  : salesplusdata.data[0].sales_quotation_option2_remark,
                sales_quotation_option1_heading : salesplusdata.data[0].sales_quotation_option1_heading,
                sales_quotation_option2_heading : salesplusdata.data[0].sales_quotation_option2_heading,
                sales_quotation_option1_discount    : salesplusdata.data[0].sales_quotation_option1_discount,
                sales_quotation_option2_discount    : salesplusdata.data[0].sales_quotation_option2_discount});
               
                
 var temp_content=salesplusdata.data[0].sales_quotation_email_content;


if(temp_content===null )
{
       email_content = {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [
                    {
                        type: "text",
                        text: ""
                    }
                ]
            }
        ]
    };
    
}
else
{
     email_content = JSON.parse(temp_content);
} 
    
setContent(email_content);

// var pay_content=salesplusdata.data[0].sales_payment_option;

// if(pay_content===null )
// {
//        payoption = {
//         type: "doc",
//         content: [
//             {
//                 type: "paragraph",
//                 content: [
//                     {
//                         type: "text",
//                         text: ""
//                     }
//                 ]
//             }
//         ]
//     };
    
// }
// else
// {
//       payoption = JSON.parse(pay_content);
   
// }     
                setpay_option(payoption);

                  
                const options2 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url2 = API_URL + "ListQuotationItem";

                const response2 = await fetch(url2, options2)

                const quoteitemlist = await response2.json(); 
                
                setquoteList(quoteitemlist.data);

const options3 = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
                }

                const url3 = API_URL + "getQuotation/"+id;

                const response3 = await fetch(url3, options3)

                const quoteList = await response3.json(); 
                
                setsalesquoteList(quoteList.data);
}


 useEffect(() => {
    getquotationdata(salesId);
  }, [])

    
    const SpinnerLoader = () => (
        <span style={{ position: 'absolute', display: 'block', right: '50px', top: '35px', zIndex: '200' }}><i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i></span>
    );

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#f4f7fa', height: '43px' })
    };


    const Loader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            //title: alert.title,
            icon: 'success',
            text: alert.text,
            type: alert.type
        });
    };

   

  


    return (

       <>
      <Tabs defaultActiveKey="Quotation">
        <Tab eventKey="Quotation" title="Quotation" >               
                <Row>

               <Col md={2}>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Date :</Form.Label>

                            <DatePicker
                            placeholderText='Select date'
                            className="form-control"
                            dateFormat="dd-MM-yyyy"
                            value={salesplusList.sales_plus_date}
                            />       
                    </Form.Group>
                    
                  </Col> 
                  <Col md={2}>

                          <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Company Name :</Form.Label>

                            <input type="text" class="form-control" value={salesplusList.sales_plus_company_name} />
                    </Form.Group>
                        
                  </Col> 

                  <Col md={2}>

                          <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Contact Person :</Form.Label>

                            <input type="text" class="form-control" value={salesplusList.sales_plus_customer_name} />
                    </Form.Group>
                        
                  </Col> 
                  <Col md={2}>

                          <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Number of Vehicle  :</Form.Label>

                            <input type="text" class="form-control" value={salesplusList.sales_quotation_quantity} />
                    </Form.Group>
                        
                  </Col> 
                  </Row>
                <Form key="quoteitem"  onSubmit={handleSubmit(savequoteitem)}>
                   <Row>
                   <Col md={2}>           
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Item Code  :</Form.Label>
                    <Form.Control as="select" {...register('quotation_item')} onChange={fnitemcode}>
                        <option value="None">Select Code</option>
                       {quoteitemList &&
                                    quoteitemList.map(person => (
                                    <option key={person.quotation_item_title} value={person.quotation_item_title}>
                                                    {person.quotation_item_title}
                                    </option>
                                            ))}   
                        </Form.Control>
                         </Form.Group>
                   </Col>

                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Item  :</Form.Label>
                    <Form.Control rows="1" placeholder="Description" {...register('quotation_item_description')} />
                    </Form.Group>
                   </Col>

                    <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Quantity  :</Form.Label>
                    <Form.Control rows="1" placeholder="Quantity" {...register('quotation_quantity')} />
                    </Form.Group>
                   </Col>

                    <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Unit Price  :</Form.Label>
                    <Form.Control rows="1" placeholder="Unit Price" {...register('quotation_prize')} />
                    </Form.Group>
                   </Col>
                    <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Vat  :</Form.Label>
                    <Form.Control rows="1" placeholder="Vat" {...register('quotation_vat')} />
                    </Form.Group>
                   </Col>
                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                     <input type="checkbox" id="checked-default" className="form-control" name="blocked"   onChange={(e) => { fnoptional(e);}} defaultChecked={optional === 1} checked={optional === 1}/> Optional
                    </Form.Group>
                    </Col>

                     { plusoption==1 &&
                        <Col md={2}>
                   <Form.Control as="select" value={optionvalue} onChange={fnoptionval} >
                        <option value="None" disabled>Select Option</option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        </Form.Control>
                    </Col>
                }

                     
                    <Col  md={4}>
                     <button type='submit' className="text-capitalize btn btn-success">Add</button>
                     <button
                            className="text-capitalize btn btn-danger"
                            type="button" onClick={()=>resetquotedata()} >
                           Clear
                        </button>
                       
                   </Col>
                   
                   </Row>

                </Form>
                 { optionvalue==1 &&
                  <Row>
                   <Col md={2}>           
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label> Option {optionvalue} Discount  :</Form.Label>
                    <Form.Control rows="1" placeholder="Discount" value={salesplusList.sales_quotation_option1_discount}onChange={fndiscount1} />
                    </Form.Group>
                        
                   </Col>

                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Option {optionvalue} Heading:</Form.Label>
                    <Form.Control rows="1" placeholder="Heading" {...register('sales_quotation_option1_heading')} />
                    </Form.Group>
                   </Col>
                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Option {optionvalue} Remarks:</Form.Label>
                    <Form.Control rows="1" placeholder="Remarks" {...register('sales_quotation_option1_remark')} />
                    </Form.Group>
                   </Col>
                { plusoption==0 &&
                    <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>&nbsp;</Form.Label>
                    <button type='button' onClick={()=>addoption()}   className="text-capitalize btn btn-success">+ Option</button>
                    </Form.Group>
                   </Col>
               }
                   </Row>
               }
                { optionvalue==2 &&
                   <Row>
                   <Col md={2}>           
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label> Option {optionvalue} Discount  :</Form.Label>
                    <Form.Control rows="1" placeholder="Discount" onChange={fndiscount2} value={salesplusList.sales_quotation_option2_discount}/>
                    </Form.Group>
                        
                   </Col>

                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Option {optionvalue} Heading:</Form.Label>
                    <Form.Control rows="1" placeholder="Heading" {...register('sales_quotation_option2_heading')}/>
                    </Form.Group>
                   </Col>
                   <Col md={4}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Option {optionvalue} Remarks:</Form.Label>
                    <Form.Control rows="1" placeholder="Remarks" {...register('sales_quotation_option2_remark')} />
                    </Form.Group>
                   </Col>
                { plusoption==0 &&
                    <Col md={2}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>&nbsp;</Form.Label>
                    <button type='button' onClick={()=>addoption()}   className="text-capitalize btn btn-success">+ Option</button>
                    </Form.Group>
                   </Col>
               }
                   </Row>   
               }    
                <Tabs defaultActiveKey="option1">
                    <Tab eventKey="option1" title="Option 1" > 
                   <Table responsive style={{border:'1px solid #eaeaea',borderTop:'none'}}>
                    <thead>
                      <tr>
                        <th>Sl No.</th>
                         <th>Item</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Prize</th>
                        <th>VAT</th>
                        <th>Total</th>
                        <th></th>
                        </tr>
                    </thead>
                      <tbody>
                    {

                        salesquoteList.filter(item => item.quotation_option_number == 1).map((item, index) => (
                        
                        
                      <tr>
                      <td>{slno++}</td>
                      <td>{item.quotation_item}</td>
                      <td>{item.quotation_item_description}</td>
                      <td>{item.quotation_quantity}</td>
                      <td>{item.quotation_prize}</td>
                      <td>{item.quotation_vat}</td>
                      <td>{item.quotation_quantity*item.quotation_prize}</td>
                      <td>
                        <Button  onClick={()=>editsaleplusitem(item.quotation_id)}  className='text-capitalize' variant="primary" style={{ padding: '1px' }}><i className="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                            <Button onClick={()=>{if(window.confirm('Delete the item?')){deletesaleplusitem(item.quotation_id)}}}   className='text-capitalize' variant="primary" style={{ padding: '1px' }}><i className="fas fa-trash-alt" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                      </td>
                      </tr>
                    ))}
                    <tr>
                    <td colSpan={6}>Total</td><td>
                    {(salesquoteList.filter(item => item.quotation_option_number == 1).reduce((amount, item) => (
                          amount +=item.quotation_quantity*item.quotation_prize),0
                        ))-discount1} 
                    </td><td></td>
                    </tr>
                     <tr>
                    <td colSpan={6}>Discount</td><td>{discount1}</td><td></td>
                    </tr>
                     <tr>
                    <td colSpan={6}>Total With VAT</td><td>
                    {salesquoteList.filter(item => item.quotation_option_number == 1).reduce((totwvat, item) => (
                          totwvat +=(item.quotation_quantity*item.quotation_prize+(item.quotation_quantity*item.quotation_prize*item.quotation_vat)/100)),0
                        )}
                        </td><td></td>
                    </tr>
                     </tbody>         
                  </Table> 
                    </Tab>
                { plusoption==1 &&
                <Tab eventKey="option2" title="Option 2">

                      <Table responsive style={{border:'1px solid #eaeaea',borderTop:'none'}}>
                    <thead>
                      <tr>
                        <th>Sl No.</th>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Prize</th>
                        <th>VAT</th>
                        <th>Total</th>
                        <th></th>
                        </tr>
                    </thead>
                      <tbody>
                    {
                        
                        salesquoteList.filter(item => item.quotation_option_number == 2).map((item, index) => (
                         
                        
                        
                      <tr>
                      <td>{slno++}</td>
                      <td>{item.quotation_item}</td>
                      <td>{item.quotation_item_description}</td>
                      <td>{item.quotation_quantity}</td>
                      <td>{item.quotation_prize}</td>
                      <td>{item.quotation_vat}</td>
                      <td>{item.quotation_quantity*item.quotation_prize}</td>
                      <td>
                        <Button  onClick={()=>editsaleplusitem(item.quotation_id)}  className='text-capitalize' variant="primary" style={{ padding: '1px' }}><i className="fa fa-edit" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                            <Button onClick={()=>deletesaleplusitem(item.quotation_id)}   className='text-capitalize' variant="primary" style={{ padding: '1px' }}><i className="fas fa-trash-alt" style={{ fontWeight: 'normal', margin: 0 }}></i></Button>
                      </td>
                      </tr>
                    ))}
                    <tr>
                    <td colSpan={6}>Total</td><td> 
                     {(salesquoteList.filter(item => item.quotation_option_number == 2).reduce((amount, item) => (
                          amount +=item.quotation_quantity*item.quotation_prize),0
                        ))-discount2} 
                     </td><td></td>
                    </tr>
                     <tr>
                    <td colSpan={6}>Discount</td><td>{discount2}</td><td></td>
                    </tr>
                     <tr>
                    <td colSpan={6}>Total With VAT</td><td>
                     {salesquoteList.filter(item => item.quotation_option_number == 2).reduce((totwvat, item) => (
                          totwvat +=(item.quotation_quantity*item.quotation_prize+(item.quotation_quantity*item.quotation_prize*item.quotation_vat)/100)),0
                        )}
                     </td><td></td>
                    </tr>
                     </tbody>         
                  </Table> 

                </Tab>
                }
                 </Tabs>
                </Tab>
                <Tab eventKey="Details" title="Details">
                  <Row>

               <Col md={2}>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Payment Code :</Form.Label>

                            <Form.Control as="select">
                        <option value="None">Select Option</option>
                        <option value="None">option1 </option>
                         <option value="None">option2 </option>
                        </Form.Control>
                    </Form.Group>
                    
                  </Col> 
                  <Col md={4}>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Customer Email :</Form.Label>

                            <input type="text" class="form-control" {...register('sales_plus_email')}/>
                    </Form.Group>
                        
                  </Col> 

                  <Col md={6}>

                          <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Email Subject :</Form.Label>

                            <input type="text" class="form-control" {...register('sales_quotation_email_subject')} />
                    </Form.Group>
                        
                  </Col> 
                  </Row>
                    <Row>

               <Col md={12}>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Email Content :</Form.Label>
                          <Editor defaultValue={email_content}   onChange={setContent}/> 
                        <Form.Control as="textarea"  rows="3" {...register('sales_quotation_email_content')}/>
                    </Form.Group>
                    
                  </Col>
                  </Row>
                  <Row> 
                  <Col md={12}>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Payment Option :</Form.Label>
                         <Editor defaultValue={pay_option}   onChange={setpay_option}/> 
                           <Form.Control as="textarea"  rows="3" {...register('sales_payment_option')} />
                    </Form.Group>
                        
                  </Col> 
                  </Row>
                </Tab>
        </Tabs>

           <Row>
            <Form  target="_blank" onSubmit={handleSubmit(previewQuotes)} >
               <Col md={12}>
                        <button type='submit' className="text-capitalize btn btn-success"  >Preview</button>
                        </Col> 
       
        </Form>  

        <Form  target="_blank" onSubmit={handleSubmit(saveQuotes)} >
       

               <Col md={12}>
               <button type='submit' className="text-capitalize btn btn-primary"> {salesplusList.isQuotation==0?'Send Quotation':'Revise Quote'}</button>
               </Col> 
       
        </Form>  
         </Row>       
        </>
    );
};

export default Salesplusquotation;