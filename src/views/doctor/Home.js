import React, { Component } from "react";
import { Container, Row, Button, Card, Table, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { storeUserData } from "../../redux-store/actions/userAction";
import { Colors } from "../../constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarCheck,
	faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../patient/Home.css";
import CustomJumbotron from "../../components/custom-Jumbotron/Custom-Jumbotron";
import { WhiteBGOpacity } from "../../constants";
import ConfigRouter from "../../config/router";
import CustomButton from "../../components/custom-Button/CustomButton";
import ReactStars from 'react-rating-stars-component'
import Chart from "react-google-charts"
import {
	getDoctorsNextAppointment,
	getDoctorsPendingPaymentList,
	sendAppointmentReminder
} from "../../api-service/index";
import Common from "../../utilities/common";
import moment from "moment"

class Home extends Component {
	constructor(props) {
		super(props);
		const { userStore } = props;
		this.state = {
			id: userStore.id,
			nextPatientName: "",
			nextPatientTime: "",
			nextPatientStatus: "",
			nextPatientNameDisplay: "No more Appointments Today",
			nextPatientTimeDisplay: "NA",
			nextPatientStatusDisplay: "NA",
			pendingPaymentsList : [],
			nextAppointmentDetails:[]
		};
		
	}

	componentDidMount() {
		this.getPendingPaymentsList();
		this.getNextAppointmentDetails();
	}

	getPendingPaymentsList = async ()=>{
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		let params = {
			doctor_id:id,
			accessToken
		}
		try {
			const apiResponse = await getDoctorsPendingPaymentList(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.setState({
					pendingPaymentsList : data.data
				})
			} else {
				
			}
		} catch (error) {

		}
	}
	sendReminderToPatient= async (data)=>{	
		const { userStore } = this.props;
		const { accessToken } = userStore;
		let params = {
			id:data.id,
			patient_id : data.patient_id,
			accessToken
		}
		try {
			const apiResponse = await sendAppointmentReminder(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				alert(data.message);
			} else {
				alert(data.message);
			}
		} catch (error) {
			alert("Something wen't wrong, please try again");
		}
	}

	getNextAppointmentDetails = async () => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		const params = {
			doctor_id: id,
			accessToken
		}
		try {
			const apiResponse = await getDoctorsNextAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				const { today=[] } =data.data; 
				var tempNextAppointmentDetails = []
				today.map((data, key)=>{
					if(moment().isBefore(moment(data.start_time))) tempNextAppointmentDetails.push(data)
					return data
				})
				this.setState({
					nextAppointmentDetails : tempNextAppointmentDetails
				})
			} else {

			}
		} catch (error) {

		}
	}
	
	render() {
		const { userStore } = this.props;
		const { utype, fname } = userStore;
		const { pendingPaymentsList,nextAppointmentDetails } = this.state;
		let nextAptDetails = (nextAppointmentDetails.length > 0) ? nextAppointmentDetails[0] : {
			start_time: "N/A",
			service_type: "No appointments",
			status: "N/A"
		}
		return (
			<Container className="pb-2">
				<CustomJumbotron
					utype={utype}
					fname={fname}
					onCustomButtonClick={() => {
						this.props.history.push(
							ConfigRouter.doctor.addPatient
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
								<h5>View My Appointments</h5>
								<Card.Text>Today's and tomorrow's schedule</Card.Text>
								<CustomButton
									text={"View"}
									onCustomButtonClick={() => {
										this.props.history.push(
											ConfigRouter.doctor.appointments
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
								<h5>Upcoming Conferences</h5>
								<Card.Text>Click for more info</Card.Text>
								<a href="https://www.mdlinx.com/dentistry/conference.cfm"><Button
									style={{
										backgroundColor: `${Colors.cyan}`,
									}}
								>
									View
								</Button></a>
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
								<h5>Next Patient Details</h5>

							</Card.Header>
							<Card.Body>
								<Card.Text>Service: {nextAptDetails.service_type}</Card.Text>
								<Card.Text>Time of Appointment: { (nextAptDetails.start_time !== "N/A") ? Common.convertDate(nextAptDetails.start_time): nextAptDetails.start_time }</Card.Text>
								<Card.Text>Check In status: {nextAptDetails.status}</Card.Text>
							</Card.Body>
						</Card>

					</Col>

				</Row>


				<Row className="justify-content-between my-3">
					<Col className="mt-2">
						<Card
							col={2}
							className="text-center"

							style={WhiteBGOpacity}
						>
							<Card.Header>
								<h5>Your Weekly Performance</h5>
							</Card.Header>
							<Card.Body>

								<Card.Text>Revenue generated this week</Card.Text>
								<Chart
									className="pt-5"

									height={'300px'}
									chartType="Bar"
									loader={<div>Loading Chart</div>}

									data={[
										['Week days', 'Earnings'],
										['Monday', 1000],
										['Tuesday', 1000],
										['Wednesday', 660],
										['Thursday', 1030],
										['Friday', 1030]
									]}
									options={{
										// Material design options

										chart: {
											title: 'Weekly Revenue'



										},
										colors: ['orange']

									}}
									// For tests
									rootProps={{ 'data-testid': '2' }}
								/>
							</Card.Body>
						</Card>
					</Col>

					<Col className="mt-2">
						<Card
							col={2}
							className="text-center"

							style={WhiteBGOpacity}
						>
							<Card.Header>
								<h5>Your Average Rating</h5>
							</Card.Header>
							<Card.Body >

								<Card.Text>Feedback from your patients</Card.Text>
								<ReactStars
									count={5}
									size={60}
									value={2}
									className="my-5"
									emptyIcon={<i className='far fa-star'></i>}
									halfIcon={<i className='fa fa-star-half-alt'></i>}

									fullIcon={<i className='fa fa-star'></i>}
									half={false}
									edit={false}
									color2={'#ffd700'} />
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<Card
							className="text-center col-lg-12 col-md-12 col-sm-12 col-xl-12"
							style={WhiteBGOpacity}>
							<Card.Header>
								<h5>Pending Payments</h5>
							</Card.Header>
							<Card.Body>
								<Table responsive="sm">
									<tbody>
										{
											pendingPaymentsList.map((data, key)=>{
												return(
													<tr id="zoom" key={key} className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
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
															<CustomButton
																text={"Remind Now"}
																onCustomButtonClick={() => {
																	this.sendReminderToPatient(data);
																}}
															/>
														</td>
													</tr>
												)
											})
										}
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
