import React, { useState, useEffect, useCallback } from 'react';

import { Row, Col, Button, Form, Card, Table } from 'react-bootstrap';

import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

import { useForm } from "react-hook-form";

import Moment from 'moment';

import { API_URL } from "../../config/constant";

import './customers.css';

const authToken = localStorage.getItem('authToken');

function CustomerExpiryForm({ id, hideExpDatePopup }) {

	const selectedCustomerId = id;

	const [expDateList, setexpDateList] = useState([]);

	const today = new Date();

	const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const [expMonth, setexpMonth] = useState(today.getMonth() + 1);
	const [expYear, setexpYear] = useState(today.getFullYear());
	const [selectedExpiryDate, setselectedExpiryDate] = useState(monthList[today.getMonth()] + '-' + today.getFullYear());
	const [customerExpDate, setcustomerExpDate] = useState('01-' + monthList[today.getMonth()] + '-' + today.getFullYear());

	const { register, handleSubmit, reset, setValue } = useForm({
		defaultValues: {
			expMonth: expMonth,
			expYear: expYear,
			customer_exp_count: "",
			customer_exp_type: "both",
			customer_exp_remark: "",
			selectedExpiryDate: selectedExpiryDate,
			customer_exp_date: customerExpDate,
			customer_exp_id: 0,
		},
	});

	const sweetAlertHandler = (alert) => {
		const MySwal = withReactContent(Swal);
		MySwal.fire({
			//title: alert.title,
			icon: alert.type,
			text: alert.text,
			type: alert.type
		});
	};

	const expiryList = async () => {

		try {
			const options = {
				method: 'get',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			}

			const url = API_URL + "getSubscriptionExpDates/" + selectedCustomerId;

			const response = await fetch(url, options)

			const data = await response.json();

			setexpDateList(data.data);

			reset({
				expMonth: expMonth,
				expYear: expYear,
				customer_exp_count: "",
				customer_exp_type: "both",
				customer_exp_remark: "",
				selectedExpiryDate: selectedExpiryDate,
				customer_exp_date: customerExpDate,
				customer_exp_id: 0,
			});


		}
		catch {

		}
	}

	useEffect(() => {
		expiryList();
	}, [])

	const handleExpMonthChange = (e) => {
		const month = e.target.value;
		setexpMonth(month);
		setselectedExpiryDate(monthList[month] + '-' + expYear);
		setcustomerExpDate('01-' + month + '-' + expYear);
		setValue('selectedExpiryDate', monthList[month - 1] + '-' + expYear);
	};

	const handleExpYearChange = (e) => {
		const year = e.target.value;
		setexpYear(year);
		setselectedExpiryDate(expMonth + '-' + year);
		setcustomerExpDate('01-' + expMonth + '-' + year);
		setValue('selectedExpiryDate', monthList[expMonth - 1] + '-' + year);
	};

	const clearExpiryForm = () => {

		setexpMonth(today.getMonth() + 1);
		setexpYear(today.getFullYear());
		setselectedExpiryDate(monthList[today.getMonth()] + '-' + today.getFullYear());
		setcustomerExpDate('01-' + monthList[today.getMonth()] + '-' + today.getFullYear());

		reset({
			expMonth: today.getMonth() + 1,
			expYear: today.getFullYear(),
			customer_exp_count: "",
			customer_exp_type: "both",
			customer_exp_remark: "",
			selectedExpiryDate: monthList[today.getMonth()] + '-' + today.getFullYear(),
			customer_exp_date: '01-' + monthList[today.getMonth()] + '-' + today.getFullYear(),
			customer_exp_id: 0,
		});
	}

	const onSubmit = async (datarow) => {

		const datapost = { ...datarow, customer_exp_date: customerExpDate };

		try {
			const options = {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'Xtoken': authToken
				},
				body: JSON.stringify(datapost),
			};

			if (datarow.customer_exp_id > 0) {

				const url = API_URL + "editExpiryDate/" + datarow.customer_exp_id;

				const response = await fetch(url, options)

				const data = await response.json();

				if (data.status === 'success') {

					sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully edited expiry date!' })

					expiryList();

					clearExpiryForm();

				} else {
					sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in editing expiry date!' })
				}

			} else {

				const url = API_URL + "addExpiryDate/" + selectedCustomerId;

				const response = await fetch(url, options)

				const data = await response.json();

				if (data.status === 'success') {

					sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully added expiry date!' })

					expiryList();

					clearExpiryForm();

				} else {
					sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in adding expiry date!' })
				}

			}

		}
		catch {

		}
	}

	const getSingleExpiryDateDetails = async (id) => {

		try {
			const options = {
				method: 'get',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'Xtoken': authToken
				}
			}

			const url = API_URL + "getSingleExpDateDetails/" + id;

			const response = await fetch(url, options)

			const data = await response.json();

			const expdata = data.data;

			const expdate = new Date(expdata.customer_exp_date);

			setexpMonth(expdate.getMonth() + 1);
			setexpYear(expdate.getFullYear());
			setselectedExpiryDate(monthList[expdate.getMonth()] + '-' + expdate.getFullYear());
			setcustomerExpDate('01-' + (expdate.getMonth() + 1) + '-' + expdate.getFullYear());

			reset({
				expMonth: expdate.getMonth() + 1,
				expYear: expdate.getFullYear(),
				customer_exp_id: expdata.customer_exp_id,
				customer_exp_count: expdata.customer_exp_count,
				customer_exp_type: expdata.customer_exp_type,
				customer_exp_remark: expdata.customer_exp_remark,
				selectedExpiryDate: monthList[expdate.getMonth()] + '-' + expdate.getFullYear(),
				customer_exp_date: '01-' + (expdate.getMonth() + 1) + '-' + expdate.getFullYear(),

			});
		}
		catch {

		}
	}

	const deleteSingleExpiryDateDetails = async (id) => {

		try {
			const options = {
				method: 'get',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'Xtoken': authToken
				}
			}

			const url = API_URL + "deleteExpiryDate/" + id;

			const response = await fetch(url, options)

			const data = await response.json();

			if (data.status === 'success') {

				sweetAlertHandler({ title: 'Good job!', type: 'success', text: 'Successfully deleted expiry date!' })

				expiryList();

			} else {
				sweetAlertHandler({ title: 'Error!', type: 'error', text: 'Error in deleting expiry date!' })
			}
		}
		catch {

		}
	}

	const hidePopup = () => {
		hideExpDatePopup();
	}

	return (
		<div>
			<Row>
				<Col sm={7}>
					<Table responsive style={{ border: '1px solid #eaeaea', borderTop: 'none' }}>
						<thead>
							<tr>
								<th>Date</th>
								<th>Count</th>
								<th>Type</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{expDateList.map((item, index) => (
								<tr>
									<td>{item.customer_exp_date}</td>
									<td>{item.customer_exp_count}</td>
									<td>{item.customer_exp_type === 'both' ? 'Software & Data' : item.customer_exp_type === 's/w' ? 'Software' : 'Data'}</td>
									<td>
										<Button variant="primary" onClick={() => getSingleExpiryDateDetails(item.customer_exp_id)} style={{ padding: '5px' }}>Edit</Button>
										<Button variant="danger"
											onClick={() => {
												const confirmBox = window.confirm(
													"Are you sure you want to delete this?"
												)
												if (confirmBox === true) {
													if (expDateList.length > 1) {
														deleteSingleExpiryDateDetails(item.customer_exp_id)
													} else {
														window.alert("It cannot be deleted because this is the only one expiry date")
													}
												}
											}} style={{ padding: '5px' }}>Delete</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>

				<Col sm={5}>
					<Card>
						<Card.Body>
							<Row>
								<Col md={12}>
									<Form key="expdateform" onSubmit={handleSubmit(onSubmit)}>
										<Form.Group controlId="exampleForm.ControlInput1" style={{ margin: 0 }}>
											<Form.Label>Expiry Date</Form.Label>

											<Form.Control type="text" {...register('customer_exp_id')} hidden />

											<Form.Control type="text" placeholder="Date" {...register('selectedExpiryDate')} />
										</Form.Group>
										<Row>
											<Col md={6} style={{ paddingRight: 0 }}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Control as="select" {...register('expMonth')} onChange={handleExpMonthChange}>
														<option value={1}>January</option>
														<option value={2}>February</option>
														<option value={3}>March</option>
														<option value={4}>April</option>
														<option value={5}>May</option>
														<option value={6}>June</option>
														<option value={7}>July</option>
														<option value={8}>August</option>
														<option value={9}>September</option>
														<option value={10}>October</option>
														<option value={11}>November</option>
														<option value={12}>December</option>
													</Form.Control>
												</Form.Group>
											</Col>
											<Col md={6} style={{ paddingLeft: 0 }}>
												<Form.Group controlId="exampleForm.ControlSelect2">
													<Form.Control as="select" {...register('expYear')} onChange={handleExpYearChange}>
														<option value={2017}>2017</option>
														<option value={2018}>2018</option>
														<option value={2019}>2019</option>
														<option value={2020}>2020</option>
														<option value={2021}>2021</option>
														<option value={2022}>2022</option>
														<option value={2023}>2023</option>
														<option value={2024}>2024</option>
														<option value={2025}>2025</option>
													</Form.Control>
												</Form.Group>
											</Col>
										</Row>
										<Form.Group controlId="exampleForm.ControlInput2">
											<Form.Label>Count</Form.Label>
											<Form.Control type="text" placeholder="Count" {...register('customer_exp_count')} />
										</Form.Group>

										<Form.Group controlId="exampleForm.ControlSelect3">
											<Form.Label>Status</Form.Label>
											<Form.Control as="select" {...register('customer_exp_type')}>
												<option value="both">Software & Data</option>
												<option value="s/w">Software</option>
												<option value="data">Data</option>
											</Form.Control>
										</Form.Group>

										<Form.Group controlId="exampleForm.ControlTextarea1">
											<Form.Label>Remarks</Form.Label>
											<Form.Control as="textarea" rows="3" {...register('customer_exp_remark')} />
										</Form.Group>

										<Button variant="success" type='submit'>Submit</Button>
										<Button variant="secondary" onClick={() => hidePopup()}>Close</Button>
									</Form>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);

};

export default CustomerExpiryForm;