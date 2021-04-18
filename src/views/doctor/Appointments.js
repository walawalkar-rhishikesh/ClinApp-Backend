import React, { Component } from "react";
import { Tabs, Tab, Container, Table } from "react-bootstrap";
import { connect } from "react-redux";
import {
	getDoctorsNextAppointment,
	sendAppointmentReminder,
} from "../../api-service/index";
import Common from "../../utilities/common";
import CustomButton from "../../components/custom-Button/CustomButton";
import { WhiteBGOpacity } from "../../constants";


class Appointments extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			key: "Today",
			todaysAppointmentDetails: [],
			tomorrowAppointmentDetails: [],
		};
	}

	componentDidMount() {
        this.getNextAppointmentDetails();
    }

	sendReminderToPatient = async (data) => {
		const { userStore } = this.props;
		const { accessToken } = userStore;
		let params = {
			id: data.id,
			patient_id: data.patient_id,
			accessToken,
		};
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
	};

	getNextAppointmentDetails = async () => {
		const { userStore } = this.props;
		const { id, accessToken } = userStore;
		const params = {
			doctor_id: id,
			accessToken,
		};
		try {
			const apiResponse = await getDoctorsNextAppointment(params);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				const { today = [], tomorrow = [] } = data.data;
				this.setState({
					todaysAppointmentDetails: today,
					tomorrowAppointmentDetails: tomorrow,
				});
			} else {
			}
		} catch (error) {}
	};

	render() {
        const { todaysAppointmentDetails, tomorrowAppointmentDetails } =this.state;
		return (
			<Container className="py-3 mt-3" style={WhiteBGOpacity}>
				<Tabs>
					<Tab eventKey="Today" title="Today">
						<Table responsive="sm">
							<tbody>
								{
                                    todaysAppointmentDetails.map((data, key) => {
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
											<td>
												<CustomButton
													text={"Remind Now"}
													onCustomButtonClick={() => {
														this.sendReminderToPatient(
															data
														);
													}}
												/>
											</td>
										</tr>
									);
								})}
								{
                                    todaysAppointmentDetails.length === 0 && (
									<tr className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
										<td>No Appointments</td>
									</tr>
								)}
							</tbody>
						</Table>
					</Tab>
					<Tab eventKey="Tomorrow" title="Tomorrow">
                    <Table responsive="sm">
							<tbody>
								{
                                    tomorrowAppointmentDetails.map((data, key) => {
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
											<td>
												<CustomButton
													text={"Remind Now"}
													onCustomButtonClick={() => {
														this.sendReminderToPatient(
															data
														);
													}}
												/>
											</td>
										</tr>
									);
								})}
								{
                                    tomorrowAppointmentDetails.length === 0 && (
									<tr className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
										<td>No Appointments</td>
									</tr>
								)}
							</tbody>
						</Table>
					</Tab>
				</Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(Appointments);
