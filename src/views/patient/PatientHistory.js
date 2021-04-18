import React, { Component } from "react";
import { Table, Row, Container, Col, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { WhiteBGOpacity } from "../../constants";
import {
	checkinPatientsAppointment,
	getPatientAppointmentHistory,
	updatePayment,
} from "../../api-service/index";
import Common from "../../utilities/common";
import CustomButton from "../../components/custom-Button/CustomButton";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { PaypalSandbox } from "../../constants/index";
import ConfigRouter from "../../config/router";

class PatientHistory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appointmentHistory: [],
		};
	}
	componentDidMount() {
		this.getHistory();
	}

	onCheckedInPatientsAppointment = async (data) => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			id: data.id,
			accessToken,
		};
		try {
			const apiResponse = await checkinPatientsAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.getHistory();
				alert(data.message);
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Something went wrong, please try again");
		} finally {
		}
	};

	getHistory = async () => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			patient_id: id,
			onlyPendingPayment: false,
			accessToken,
		};
		try {
			const apiResponse = await getPatientAppointmentHistory(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.setState({
					appointmentHistory: data.data,
				});
			} else {
				// alert(data.message);
			}
		} catch (error) {
			// alert("Something went wrong, please try again");
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

	render() {
		let { appointmentHistory } = this.state;
		return (
			<Container>
				<Row className="my-3">
					<Col>
						<Card
							className="text-center col-lg-12 col-md-12 col-sm-12 col-xl-12"
							style={WhiteBGOpacity}
						>
							<Card.Header>
								<h5>Your Appointment History</h5>
							</Card.Header>

							<Card.Body>
								<Table responsive="sm">
									<tbody>
										{appointmentHistory.map((data, key) => {
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
													<td>${data.total_price}</td>
													<td>{data.service_type}</td>

													{data.status ===
														"SCHEDULED" && (
														<td>
															{" "}
															<CustomButton
																text={
																	"CHECK IN"
																}
																onCustomButtonClick={() => {
																	this.onCheckedInPatientsAppointment(
																		data
																	);
																}}
															/>
														</td>
													)}
													{data.status ===
														"CHECKEDIN" && (
														<td className="text-success"> CHECKED IN </td>
													)}
													{data.payment_status ===
													"PENDING" ? (
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
													) : (
														<td className="text-success">
															{" "}
															PAYMENT DONE{" "}
														</td>
													)}
												</tr>
											);
										})}
										{appointmentHistory.length === 0 && (
											<tr
												id="zoom"
												className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white"
											>
												<td>No records</td>
											</tr>
										)}
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PatientHistory);
