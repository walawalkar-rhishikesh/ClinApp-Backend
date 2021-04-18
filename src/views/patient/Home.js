import React, { Component } from "react";
import { Container, Row, Card, Table, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { storeUserData } from "../../redux-store/actions/userAction";
import { Colors } from "../../constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarCheck,
	faCalendarAlt,
	faCalendarMinus,
} from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import CustomJumbotron from "../../components/custom-Jumbotron/Custom-Jumbotron";
import { WhiteBGOpacity } from "../../constants";
import ConfigRouter from "../../config/router";
import CustomButton from "../../components/custom-Button/CustomButton";
import {
	getDoctorsDetails,
	getPatientsLastNextAppointments,
	patientsPendingAppointments,
	checkinPatientsAppointment,
	updatePayment,
} from "../../api-service/index";
import Common from "../../utilities/common";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { PaypalSandbox } from "../../constants/index";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			doctorsDetails: {},
			previousAppointments: [],
			nextAppointments: [],
			pendingPaymentsList: [],
		};
	}
	componentDidMount() {
		this.getDoctorDetails();
		this.getCurrentNextAppointments();
		this.getPendingPayments();
	}
	getDoctorDetails = async () => {
		const { userStore } = this.props;
		const { createdby } = userStore;

		let params = { createdby };
		try {
			const apiResponse = await getDoctorsDetails(params);
			if (apiResponse && apiResponse.data && apiResponse.data.fname) {
				this.setState({
					doctorsDetails: apiResponse.data,
				});
			}
		} catch (error) {
		} finally {
		}
	};
	getCurrentNextAppointments = async () => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			accessToken,
		};
		try {
			const apiResponse = await getPatientsLastNextAppointments(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.setState({
					previousAppointments: data.data.previous,
					nextAppointments: data.data.next,
				});
			} else {
			}
		} catch (error) {
		} finally {
		}
	};

	getPendingPayments = async () => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			accessToken,
			onlyPendingPayment: true,
		};
		try {
			const apiResponse = await patientsPendingAppointments(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.setState({
					pendingPaymentsList: data.data,
				});
			} else {
			}
		} catch (error) {
		} finally {
		}
	};

	onCheckedInPatientsAppointment = async (nextAppointmentsDetails) => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			id: nextAppointmentsDetails.id,
			accessToken,
		};
		try {
			const apiResponse = await checkinPatientsAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.getCurrentNextAppointments();
				alert(data.message);
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Something went wrong, please try again");
		} finally {
		}
	};

	updatePendingPayments = async (payment, data) => {
		const { userStore } = this.props;
		const { accessToken } = userStore;
		let params = {
			id: data.id,
			payment_id: payment.paymentID,
			accessToken,
			// onlyPendingPayment: true,
		};
		try {
			if (payment.paid) {
				const apiResponse = await updatePayment(params);
				const {
					data = { status: 400, data: {}, message: "System error" },
				} = apiResponse;
				if (data.status === 200) {
					alert(data.message);
					this.getPendingPayments();
				} else {
					alert(data.message);
				}
			} else {
				alert("Payment Failed: Please try again..");
			}
		} catch (error) {
			alert("Payment Failed: Please try again..");
		} finally {
		}
	};

	onCheckedInPatientsAppointment = async (nextAppointmentsDetails) => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			id: nextAppointmentsDetails.id,
			accessToken,
		};
		try {
			const apiResponse = await checkinPatientsAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.getCurrentNextAppointments();
				alert(data.message);
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Something went wrong, please try again");
		} finally {
		}
	};

	render() {
		const { userStore } = this.props;
		const { utype, fname } = userStore;
		const {
			doctorsDetails,
			previousAppointments,
			nextAppointments,
			pendingPaymentsList,
		} = this.state;

		let previousAppointmentsStartTime = "No appointment";
		if (previousAppointments && previousAppointments.length > 0) {
			previousAppointmentsStartTime = Common.convertDate(
				previousAppointments[0].start_time
			);
		}
		let nextAppointmentsStartTime = "No appointment";
		let hasCheckedIn = false;
		let nextAppointmentsDetails = {};
		if (nextAppointments && nextAppointments.length > 0) {
			nextAppointmentsStartTime = Common.convertDate(
				nextAppointments[nextAppointments.length - 1].start_time
			);
			hasCheckedIn =
				nextAppointments[nextAppointments.length - 1].status ===
				"CHECKEDIN"
					? true
					: false;
			nextAppointmentsDetails =
				nextAppointments[nextAppointments.length - 1];
		}

		return (
			<Container className="pb-2">
				<CustomJumbotron
					utype={utype}
					fname={fname}
					doctorName={doctorsDetails.fname}
					onCustomButtonClick={() => {
						this.props.history.push(
							ConfigRouter.patient.addAppointments
						);
					}}
				/>
				<Row className="justify-content-between my-3">
					<Col className="mt-2">
						<Card
							col={2}
							className="text-center"
							id="zoom"
							style={WhiteBGOpacity}
						>
							<Card.Header>
								<FontAwesomeIcon
									className="fa-4x"
									style={{ color: `${Colors.darkOrange}` }}
									icon={faCalendarAlt}
								/>
							</Card.Header>
							<Card.Body>
								<h5>Book Appointment</h5>
								<Card.Text>Schedule Now</Card.Text>
								<CustomButton
									text={"Book Now"}
									onCustomButtonClick={() => {
										this.props.history.push(
											ConfigRouter.patient.addAppointments
										);
									}}
								/>
							</Card.Body>
						</Card>
					</Col>

					<Col className="mt-2">
						<Card
							col={2}
							className="text-center"
							id="zoom"
							style={WhiteBGOpacity}
						>
							<Card.Header>
								<FontAwesomeIcon
									className="fa-4x"
									style={{ color: `${Colors.darkOrange}` }}
									icon={faCalendarCheck}
								/>
							</Card.Header>
							<Card.Body>
								<h5>Previous Appointment</h5>
								<Card.Text>
									{previousAppointmentsStartTime}
								</Card.Text>
								<CustomButton
									text={"Full History"}
									onCustomButtonClick={() => {
										this.props.history.push(
											ConfigRouter.patient.appointments
										);
									}}
								/>
							</Card.Body>
						</Card>
					</Col>
					<Col className="mt-2">
						<Card
							col={2}
							className="text-center"
							id="zoom"
							style={WhiteBGOpacity}
						>
							<Card.Header>
								<FontAwesomeIcon
									className="fa-4x"
									style={{ color: `${Colors.darkOrange}` }}
									icon={faCalendarMinus}
								/>
							</Card.Header>
							<Card.Body>
								<h5>Next Appointment</h5>
								<Card.Text>
									{nextAppointmentsStartTime}
								</Card.Text>
								<CustomButton
									text={
										hasCheckedIn ? "Checked In" : "Check In"
									}
									isDisabled={
										hasCheckedIn ||
										nextAppointmentsStartTime ===
											"No appointment"
											? true
											: false
									}
									onCustomButtonClick={() => {
										this.onCheckedInPatientsAppointment(
											nextAppointmentsDetails
										);
									}}
								/>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col>
						<Card
							className="text-center col-lg-12 col-md-12 col-sm-12 col-xl-12"
							style={WhiteBGOpacity}
						>
							<Card.Header>
								<h5>Your pending payments</h5>
							</Card.Header>

							<Card.Body>
								<Table responsive="sm">
									<tbody>
										{
											pendingPaymentsList.map(
											(data, key) => {
												return (
													<tr
														id="zoom"
														key={key}
														className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white"
													>
														<td>{key + 1}</td>
														<td>
															{Common.convertDate(
																data.start_time
															)}
														</td>
														<td>
															${data.total_price}
														</td>
														<td>
															{data.service_type}
														</td>
														<td>
															<PaypalExpressBtn
																onClick={() => {
																	this.props.history.push(
																		ConfigRouter
																			.patient
																			.addAppointments
																	);
																}}
																env={
																	PaypalSandbox.env
																}
																client={
																	PaypalSandbox.client
																}
																currency={
																	PaypalSandbox.currency
																}
																total={1}
																onError={(
																	pdata
																) =>
																	this.updatePendingPayments(
																		pdata,
																		data
																	)
																}
																onSuccess={(
																	pdata
																) =>
																	this.updatePendingPayments(
																		pdata,
																		data
																	)
																}
																onCancel={(
																	pdata
																) =>
																	this.updatePendingPayments(
																		pdata,
																		data
																	)
																}
															/>
														</td>
													</tr>
												);
											}
										)}
										{
											pendingPaymentsList.length === 0 &&
											<tr className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">							
												<td>No records</td>
											</tr>
										}
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		userStore: state.user,
	};
};

const mapDispatchToProps = {
	storeUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
