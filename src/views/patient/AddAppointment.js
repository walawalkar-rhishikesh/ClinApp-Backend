import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import { Colors } from "../../constants/index";
import moment from "moment";
import DatePicker from "material-ui/DatePicker";
import Dialog from "material-ui/Dialog";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import SnackBar from "material-ui/Snackbar";
//import Card from "material-ui/Card";
import { Step, Stepper, StepLabel, StepContent } from "material-ui/Stepper";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import { WhiteBGOpacity } from "../../constants"
import { addAppointment } from "../../api-service/index"
import { connect } from "react-redux";
import ConfigRouter from "../../config/router"
import Maps from "../../components/maps/maps"
import { Container, Card } from "react-bootstrap"

class Appointment extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			firstName: "",
			open: false,
			lastName: "",
			email: "",
			phone: '',
			schedule: [],
			confirmationModalOpen: false,
			appointmentDateSelected: false,
			appointmentMeridiem: 0,
			appointmentReason: "",
			validEmail: true,
			validPhone: true,
			finished: false,
			selection: null,
			smallScreen: window.innerWidth < 768,
			stepIndex: 0,
			cases: [
				"Routine Checkup",
				"Root canal",
				"Tooth Decay",
				"Braces Alignment",
				"Other"
			],
			confirmationSnackbarOpen: false,
		};
	}

	handleChange(event, index, value) {
		this.setState({ selection: value });
	}
	selectNo(value) {
		this.setState({ selection: value });
	}

	handleSetAppointmentDate(date) {
		this.setState({ appointmentDate: date, confirmationTextVisible: true });
	}

	handleSetAppointmentSlot(slot) {
		this.setState({ appointmentSlot: slot });
	}
	handleSetAppointmentReason(reason) {
		this.setState({ appointmentReason: this.state.cases[reason] });
	}
	handleSetAppointmentMeridiem(meridiem) {
		this.setState({ appointmentMeridiem: meridiem });
	}
	handleSubmit() {
		this.setState({ confirmationModalOpen: false });
		this.addPatientsAppointment();
	}

	handleNext = () => {
		const { stepIndex, appointmentDate, appointmentSlot, selection } = this.state;

		if (stepIndex === 0 && !appointmentDate) {
			alert("Please select appointment date");
			return;
		}
		if (stepIndex === 1 && appointmentSlot === undefined) {
			alert("Please select appointment time slot");
			return;
		}
		if (stepIndex === 2 && selection == null) {
			alert("Please select appointment reason");
			return;
		}
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex >= 3,
		});
	};

	handlePrev = () => {
		const { stepIndex } = this.state;
		if (stepIndex > 0) {
			this.setState({ stepIndex: stepIndex - 1 });
		}
	};
	validateEmail(email) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email)
			? this.setState({ email: email, validEmail: true })
			: this.setState({ validEmail: false, email: email });
	}
	validatePhone(phoneNumber) {
		const regex = /^(\()?\d{3}(\))?\d{3}\d{4}$/;
		return regex.test(phoneNumber)
			? this.setState({ phone: phoneNumber, validPhone: true })
			: this.setState({ validPhone: false, phone: phoneNumber });
	}
	checkDisableDate(day) {
		const dateString = moment(day).format("YYYY-DD-MM");
		return (
			this.state.schedule[dateString] === true ||
			moment(day).startOf("day").diff(moment().startOf("day")) < 0
		);
	}

	renderAppointmentConfirmation() {
		const spanStyle = { color: Colors.cyan };
		const nameStyle = { color: Colors.dark };
		return (
			<section>
				<p style={nameStyle}>
					Name:{" "}
					<span style={spanStyle}>
						{this.state.firstName} {this.state.lastName}
					</span>
				</p>
				<p style={nameStyle}>
					Reason:{" "}
					<span style={spanStyle}>
						{this.state.appointmentReason}
					</span>
				</p>
				<p style={nameStyle}>
					Number: <span style={spanStyle}>{this.state.phone}</span>
				</p>
				<p style={nameStyle}>
					Email: <span style={spanStyle}>{this.state.email}</span>
				</p>
				<p style={nameStyle}>
					Appointment:{" "}
					<span style={spanStyle}>
						{moment(this.state.appointmentDate).format(
							"dddd[,] MMMM Do[,] YYYY"
						)}
					</span>{" "}
					at{" "}
					<span style={spanStyle}>
						{moment()
							.hour(9)
							.minute(0)
							.add(this.state.appointmentSlot, "hours")
							.format("h:mm a")}
					</span>
				</p>
			</section>
		);
	}
	renderAppointmentTimes() {
		if (!this.state.isLoading) {
			const slots = [...Array(8).keys()];
			return slots.map((slot) => {
				const appointmentDateString = moment(
					this.state.appointmentDate
				).format("YYYY-DD-MM");
				const time1 = moment().hour(9).minute(0).add(slot, "hours");
				const time2 = moment()
					.hour(9)
					.minute(0)
					.add(slot + 1, "hours");
				const scheduleDisabled = this.state.schedule[
					appointmentDateString
				]
					? this.state.schedule[
					moment(this.state.appointmentDate).format(
						"YYYY-DD-MM"
					)
					][slot]
					: false;
				const meridiemDisabled = this.state.appointmentMeridiem
					? time1.format("a") === "am"
					: time1.format("a") === "pm";
				return (
					<RadioButton
						label={
							time1.format("h:mm a") +
							" - " +
							time2.format("h:mm a")
						}
						key={slot}
						value={slot}
						style={{
							marginBottom: 15,
							display: meridiemDisabled ? "none" : "inherit",
						}}
						disabled={scheduleDisabled || meridiemDisabled}
					/>
				);
			});
		} else {
			return null;
		}
	}

	renderStepActions(step) {
		const { stepIndex } = this.state;

		return (
			<div>
				<RaisedButton
					label={stepIndex === 3 ? "Close " : "Next"}
					// disableTouchRipple={true}
					// disableFocusRipple={true}
					// primary={true}
					onClick={this.handleNext}
					color='white !important'
					backgroundColor={Colors.cyan}
					style={{ marginRight: 12, color: 'white' }}
				/>
				{step > 0 && (
					<FlatButton
						label="Back"
						disabled={stepIndex === 0}
						disableTouchRipple={true}
						disableFocusRipple={true}
						onClick={this.handlePrev}
					/>
				)}
			</div>
		);
	}

	addPatientsAppointment = async (body) => {
		const { userStore } = this.props;
		const { id, createdby, utype } = userStore;
		const {  appointmentDate, appointmentReason } = this.state;
		let params = {
			doctor_id: createdby,
			patient_id: id,
			appoinment_date: moment(appointmentDate).format("YYYY-MM-DD"),
			start_time: moment(appointmentDate).format("YYYY-MM-DD") + " " + moment().hour(9).minute(0).add(this.state.appointmentSlot, "hours").format("HH:mm"),
			end_time: moment(appointmentDate).format("YYYY-MM-DD") + " " + moment().hour(9).minute(0).add(this.state.appointmentSlot + 1, "hours").format("HH:mm"),
			total_price: 150,
			service_type: appointmentReason
		}

		try {
			const apiResponse = await addAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;

			if (data.status === 200) {
				if (utype === "PATIENT") {
					// this.props.history.push(ConfigRouter.patient.main)
					window.location.href = ConfigRouter.patient.main;
				}
				if (utype === "DOCTOR") {
					// this.props.history.push(ConfigRouter.doctor.main)
					window.location.href = ConfigRouter.doctor.main;
				}
			} else {
				alert(data.message);
				this.props.history.push(
					ConfigRouter.patient.main
				);
			}
		} catch (error) {
			console.log(error)
			alert("Please try again.");
		} finally {
			this.setState({
				isLoading: false,
			});
		}
	}

	render() {
		const {
			finished,
			isLoading,
			smallScreen,
			stepIndex,
			confirmationModalOpen,
			confirmationSnackbarOpen,
			...data
		} = this.state;
		const contactFormFilled =
			data.firstName &&
			data.lastName &&
			data.phone &&
			data.email &&
			data.validPhone &&
			data.validEmail;
		const DatePickerExampleSimple = () => (
			<div>
				<DatePicker
					hintText="Select Date"
					mode={smallScreen ? "portrait" : "landscape"}
					onChange={(n, date) => this.handleSetAppointmentDate(date)}
					value={this.state.appointmentDate}
					shouldDisableDate={(day) => this.checkDisableDate(day)}
				/>
			</div>
		);
		const modalActions = [
			<FlatButton
				label="Cancel"
				primary={false}
				onClick={() => this.setState({ confirmationModalOpen: false })}
			/>,
			<FlatButton
				label="Confirm"
				primary={false}
				onClick={() => this.handleSubmit()}
			/>,
		];
		return (
			<div>
				<section
					style={{
						maxWidth: !smallScreen ? "80%" : "100%",
						margin: "auto",
						marginTop: !smallScreen ? 20 : 0,

					}}
				>
					<Card
						style={{
							padding: "12px 12px 25px 12px",
							height: smallScreen ? "100vh" : null,
							backgroundColor: WhiteBGOpacity.backgroundColor
						}}
					>
						<div>
							<h2> Schedule your appointment..</h2>{" "}
						</div>
						<Stepper
							activeStep={stepIndex}
							orientation="vertical"
							linear={false}
						>
							<Step>
								<StepLabel>
									Choose an available day for your appointment
								</StepLabel>
								<StepContent>
									{DatePickerExampleSimple()}
									{this.renderStepActions(0)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Choose an available time for your
									appointment
								</StepLabel>
								<StepContent>
									<SelectField
										floatingLabelText="AM/PM"
										value={data.appointmentMeridiem}
										onChange={(evt, key, payload) =>
											this.handleSetAppointmentMeridiem(
												payload
											)
										}
										selectionRenderer={(value) =>
											value ? "PM" : "AM"
										}
									>
										<MenuItem value={0} primaryText="AM" />
										<MenuItem value={1} primaryText="PM" />
									</SelectField>
									<RadioButtonGroup
										style={{
											marginTop: 15,
											marginLeft: 15,
										}}
										name="appointmentTimes"
										defaultSelected={data.appointmentSlot}
										onChange={(evt, val) =>
											this.handleSetAppointmentSlot(val)
										}
									>
										{this.renderAppointmentTimes()}
									</RadioButtonGroup>
									{this.renderStepActions(1)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Choose a reason for your appointment
								</StepLabel>
								<StepContent>
									<SelectField
										floatingLabelText="CLICK HERE"
										onChange={(evt, key, payload) => {
											this.handleSetAppointmentReason(
												payload
											);
											this.selectNo(payload);
										}}
										value={this.state.selection}
									>
										<MenuItem
											value={0}
											primaryText="Routine Checkup"
										/>
										<MenuItem
											value={1}
											primaryText="Root canal"
										/>
										<MenuItem
											value={2}
											primaryText="Tooth Decay"
										/>
										<MenuItem
											value={3}
											primaryText="Braces Alignment"
										/>
										<MenuItem
											value={4}
											primaryText="Other"
										/>
									</SelectField>
									{this.renderStepActions(2)}
								</StepContent>
							</Step>
							<Step>
								<StepLabel>
									Share your contact information with us and
									we'll send you a reminder
								</StepLabel>
								<StepContent>
									<div>
										<section>
											<TextField
												name="first_name"
												hintText="First Name"
												floatingLabelText="First Name"
												onChange={(evt, newValue) =>
													this.setState({
														firstName: newValue,
													})
												}
												value={this.state.firstName}
											/>
											<TextField
												name="last_name"
												hintText="Last Name"
												floatingLabelText="Last Name"
												onChange={(evt, newValue) =>
													this.setState({
														lastName: newValue,
													})
												}
												value={this.state.lastName}
											/>
											<TextField
												name="email"
												hintText="youraddress@mail.com"
												floatingLabelText="Email"
												errorText={
													data.validEmail
														? null
														: "Enter a valid email address"
												}
												onChange={(evt, newValue) =>
													this.validateEmail(newValue)
												}
												value={this.state.email}
											/>
											<TextField
												name="phone"
												hintText="1234567890"
												floatingLabelText="Phone"
												errorText={
													data.validPhone
														? null
														: "Enter a valid phone number"
												}
												onChange={(evt, newValue) =>
													this.validatePhone(newValue)
												}
												value={this.state.phone}	
											/>
											<RaisedButton
												label={
													contactFormFilled || null
														? "Schedule"
														: "Fill out your information to schedule"
												}
												labelPosition="before"
												backgroundColor={
													Colors.cyan
												}
												// primary={true}
												fullWidth={true}
												onClick={() =>
													this.setState({
														confirmationModalOpen: !this
															.state
															.confirmationModalOpen,
													})
												}
												disabled={
													!contactFormFilled ||
													data.processed
												}
											/>
										</section>
									</div>
									{this.renderStepActions(3)}
								</StepContent>
							</Step>
						</Stepper>
					</Card>
					<Dialog
						modal={true}
						open={confirmationModalOpen}
						actions={modalActions}
						title="Confirm your appointment"
					>
						{this.renderAppointmentConfirmation()}
					</Dialog>
					<SnackBar
						open={confirmationSnackbarOpen}
						message={
							isLoading
								? "Loading... "
								: data.confirmationSnackbarMessage || ""
						}
						autoHideDuration={10}
						onRequestClose={() =>
							this.setState({ confirmationSnackbarOpen: false })
						}
					/>
				</section>

				{/* 

        <CircularNavigation  >
      <CircularNavigation.item href={"#"} icon={<HomeIcon />}>
        Home
      </CircularNavigation.item>
      <CircularNavigation.item href={"#"} icon={<AnnouncementIcon />}>
        About
      </CircularNavigation.item>
      <CircularNavigation.item href={"#"} icon={<AssignmentIcon />}>
        Projects
      </CircularNavigation.item>
      <CircularNavigation.item href={"#"} icon={<BuildIcon />}>
        Labs
      </CircularNavigation.item>
      <CircularNavigation.item href={"#"} icon={<EmailIcon />}>
        Contact
      </CircularNavigation.item>
    </CircularNavigation> */}
				<br />
				<Container>
					<Card className="text-center">
						<Card.Header><b><h1>Clinic Location</h1></b></Card.Header>
						<Card.Body>
							<Maps />
						</Card.Body>
					</Card>

					{/* <Map></Map> */}
				</Container>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		userStore: state.user,
	};
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Appointment);