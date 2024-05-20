import React, { useState, useEffect } from "react";

import { Row, Col, Button, Card, Form, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

import Select from 'react-select';

import DatePicker from "react-datepicker";

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import ReactHtmlParser from 'react-html-parser';

import adminprofile from "../../assets/images/profile-logo/admin.png";

import shamsprofile from "../../assets/images/profile-logo/shams.jpg";

import shamnadprofile from "../../assets/images/profile-logo/shamnad.jpg";

import rasickprofile from "../../assets/images/profile-logo/rasick.jpg";

import ajmalprofile from "../../assets/images/profile-logo/ajmal.jpg";

import celineprofile from "../../assets/images/profile-logo/celine.jpg";

import shoneprofile from "../../assets/images/profile-logo/shone.jpg";

import ScrollToBottom from 'react-scroll-to-bottom';

import './customers.css';


function Discussions({ id, status, customerId, hideNotePopup }) {
	
	const authToken = localStorage.getItem('authToken');
	const [notearray, setNoteArray] = useState([]);
	const [customerNoteDate, setCustomerNoteDate] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const hidePopup = () =>{
		hideNotePopup();
	}

	const sweetAlertHandler = (alert) => {
	    const MySwal = withReactContent(Swal);
	    MySwal.fire({
	      icon: 'success',
	      text: alert.text,
	      type: alert.type
	    });
	};

	const Loader = () => (
	    <div className="divLoader popupLoader">
	      <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
	        <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
	      </svg>
	    </div>
	);

	const getCustomerNotes = async () => {

			setIsLoading(true);

			try {
		      	const options = {
			        method: 'get',
			        headers: {
			          'Accept': 'application/json, text/plain, */*',
			          'Content-Type': 'application/json',
			          'Xtoken': authToken
			        }
		      	}

		      	const url = API_URL + "customernotes/" + customerId;

		      	const response = await fetch(url, options)

		      	const data = await response.json();

		      	setNoteArray(data.data);

		      	setIsLoading(false);
		    }
		    catch {

		    }
	}

	
	useEffect(() => {

		
		getCustomerNotes();
	},[])

	const {
	    register,
	    handleSubmit,
	    reset
	} = useForm({
	    defaultValues: {
	      customer_note_text: '',
	      customer_note_id: 0,
	      customer_id: customerId,
	      id: id,
	      status: status
	    }
	});

	const changeRemDate = (selectedtype) => {

        if (selectedtype === 'tomorrow') {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            setCustomerNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1w') {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            setCustomerNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '2w') {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            setCustomerNoteDate(new Date(date).setHours(9, 0, 0));
        } else if (selectedtype === '1m') {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            setCustomerNoteDate(new Date(date).setHours(9, 0, 0));
        }
  };

	const handleCustomerNoteDateChange = (date) => {
		const selectedHour = new Date(date).getHours();
        if (selectedHour===0) {
            setCustomerNoteDate(new Date(date).setHours(9, 0, 0));
        }else{
            setCustomerNoteDate(date);
        }
	};

  	const saveCustomerNote = async (data) => {

  		setIsLoading(true);

    	const postdata = { ...data, customer_note_text: data.customer_note_text.replace(/\r?\n/g, '<br/>'), customer_note_date: customerNoteDate ? Moment(customerNoteDate).format('YYYY-MM-DD HH:mm:ss') : ''};

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

	      	const url = API_URL + "saveCustomerNotes";

	      	const response = await fetch(url, options)

	      	const resdata = await response.json();

	      	setIsLoading(false);

	      	if (resdata.status === 'success') {

	        	sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully updated notes!' })

	      	} else {
	        	sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in updating note!' })
	      	}

	      	reset({
	      		customer_note_text: '',
			    customer_note_id: 0,
			    customer_id: customerId,
			    id: id,
			    status: status
			 })

	      	getCustomerNotes();
	    }
	    catch {

	    }
  	}

	return (
		<>
			<Row>
	            <Col md={12}>
	            	{isLoading ? <Loader /> : null}
	              	<Card style={{ margin: 0 }}>
		                <Card.Body className='task-comment'>

		                  {notearray && notearray.length > 0 &&
		                    <ScrollToBottom className="mon-note-list">
		                      	<ul className="media-list p-0">

			                        {notearray.map((note, index) => (
			                          	<li className="media mb-3">
				                            <div className="media-left mr-3" style={{fontSize:'11px'}}>
				                              <img className="media-object img-radius comment-img" src={note.note_by==='admin'?adminprofile:note.note_by==='Shams'?shamsprofile:note.note_by==='Shamnad'?shamnadprofile:note.note_by==='Rasick'?rasickprofile:note.note_by==='Ajmal'?ajmalprofile:note.note_by==='Celine'?celineprofile:note.note_by==='Shone'?shoneprofile:adminprofile} alt="Generic placeholder" /><br/>
				                              <span style={{color:'black'}}><b>[{note.type==='blocked'?'Blocked':note.type==='training'?'Training':note.type==='monitoring'?'Monitoring':note.type==='subdue'?'Subscription Due':note.type==='customer'?'Customer':note.type==='sub'?'Subscription':''}]</b></span>
				                            </div>
				                            <div className="media-body">
				                              <h6 className="media-heading text-muted">
				                                {note.note_by}

				                                <span className="f-12 text-muted ml-1">{Moment(note.created_at).format('DD MMM YYYY HH:mm')}</span>

				                                <span style={{ fontWeight: 'bold', marginRight: '25px', float: 'right', color: 'black' }}>{note.note_date !== '0000-00-00 00:00:00' ? '[' + note.note_date + ']' : ''}</span>

				                              </h6>
				                              <p style={{ color: 'black', marginBottom: 0 }}>
				                                {ReactHtmlParser(note.note_text)}
				                              </p>

				                              	<OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Reminder Removal Reason</Tooltip>}>
				                              		<p style={{fontStyle:'italic',width:'fit-content'}}>{ReactHtmlParser(note.remove_reminder_text)} </p>
				                              	</OverlayTrigger>
				                            </div>
			                          	</li>
			                        ))}
		                      	</ul>
		                    </ScrollToBottom>}

		                  	<Form className='mt-4' key="commentform" onSubmit={handleSubmit(saveCustomerNote)}>
			                    <Row>
			                      <Col md="6"></Col>
			                      <Col md="6">

			                      	<ButtonGroup style={{ marginBottom: '5px', float: 'right' }}>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Tomorrow</Tooltip>}>
                                                        <Button variant="danger" onClick={() => changeRemDate('tomorrow')} style={{ padding: '10px 20px' }}>T</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Week</Tooltip>}>
                                                        <Button variant="warning" onClick={() => changeRemDate('1w')}>1 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Two Week</Tooltip>}>
                                                        <Button variant="info" onClick={() => changeRemDate('2w')}>2 W</Button>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>One Month</Tooltip>}>
                                                        <Button variant="success" onClick={() => changeRemDate('1m')}>1 M</Button>
                                                    </OverlayTrigger>
                                                </ButtonGroup>

			                        <Form.Group>
			                          <DatePicker
			                            placeholderText='Select date'
			                            // todayButton={"Today"}
			                            selected={customerNoteDate}
			                            onChange={handleCustomerNoteDateChange}
			                            className="form-control"
			                            showTimeSelect
			                            timeFormat="HH:mm"
			                            timeIntervals={15}
			                            dateFormat="dd-MM-yyyy h:mm aa"
			                            timeCaption="time"
			                            isClearable={true}
			                          />
			                        </Form.Group>
			                      </Col>

			                      <Col md="12">
			                        <Form.Group>
			                          <Form.Control as="textarea" placeholder='Add Note...' rows="3" {...register('customer_note_text')} />
			                        </Form.Group>
			                      </Col>

			                    </Row>	                    

			                    <Button variant="success" type='submit' style={{ margin: '10px auto 0', float: 'right' }}>Comment</Button>
			                </Form>
		                </Card.Body>
		            </Card>
	            </Col>
	        </Row>
		</>
	);

}

export default Discussions