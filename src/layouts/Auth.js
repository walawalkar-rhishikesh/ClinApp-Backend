import React, { Component } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import { signin, signinWithGoogle } from "../api-service";
import Alerts from "../components/alerts/Alerts";
import { connect } from "react-redux";
import { storeUserData } from "../redux-store/actions/userAction";
// import { Redirect } from "react-router-dom";
import RouterConfig from "../config/router"
import { Colors } from "../constants/index"



class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			showAlert: false,
			alertMessage: "",
			alertTitle: "",
			alertType: "",
			isPrimaryBtnFunction: false,
			isSecondaryBtnFunction: false,
			isLoading: false,
		};
		this.onSignIn = this.onSignIn.bind(this);
		this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
	}

	onSubmit = (e) => {
		e.preventDefault();
		const { email, password } = this.state;
		const params = {
			email,
			password,
		};
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			this.setAlertMessages("EMAIL");
			return;
		}
		if (
			!password.match(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
			)
		) {
			this.setAlertMessages("PASSWORD");
			return;
		}
		this.setAlertMessages();
		this.getAlertMessage(false);
		this.setState({
			isLoading: true,
		});
		this.onSignIn(params);
	};

	onSignIn = async (body) => {
		try {
			const apiResponse = await signin(body);
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.props.storeUserData(data.data);

				if (data.data.utype === "PATIENT") {
					this.props.history.push(RouterConfig.patient.main)
				}
				if (data.data.utype === "DOCTOR") {
					this.props.history.push(RouterConfig.doctor.main)
				}

			} else {
				this.setAlertMessages("SIGNIN", "Signin Error", data.message);
			}
		} catch (error) {
			this.setAlertMessages(
				"SIGNIN",
				"Signin Error",
				"Something went wrong, please try again"
			);
		} finally {
			this.setState({
				isLoading: false,
			});
		}
	};

	onGoogleSignIn = async (googleUser) => {
		console.log(googleUser)
		const { profileObj = {} } = googleUser;
		const { email, googleId } = profileObj;
		try {
			const apiResponse = await signinWithGoogle({ email, googleId });
			const {
				data = { status: 400, data: {}, message: "System error" },
			} = apiResponse;
			if (data.status === 200) {
				this.props.storeUserData(data.data);

				if (data.data.utype === "PATIENT") {
					this.props.history.push(RouterConfig.patient.main)
				}
				if (data.data.utype === "DOCTOR") {
					this.props.history.push(RouterConfig.doctor.main)
				};
			} else {
				this.setAlertMessages("SIGNIN", "Signin Error", data.message);
			}
		} catch (error) {
			this.setAlertMessages(
				"SIGNIN",
				"Signin Error",
				"Something went wrong, please try again"
			);
		} finally {
			this.setState({
				isLoading: false,
			});
		}
	};

	getAlertMessage(showAlert) {
		this.setState({
			showAlert,
		});
		if (!showAlert) {
			this.setState({
				alertMessage: "",
				alertTitle: "",
				alertType: "",
				isPrimaryBtnFunction: false,
				isSecondaryBtnFunction: false,
			});
		}
	}
	setAlertMessages(type, title, message) {
		// eslint-disable-next-line default-case
		switch (type) {
			case "EMAIL":
				this.setState({
					alertMessage: "You have entered an invalid email",
					alertTitle: "Invalid Email",
					alertType: "danger",
					showAlert: true,
					isPrimaryBtnFunction: false,
					isSecondaryBtnFunction: false,
				});
				break;
			case "PASSWORD":
				this.setState({
					alertMessage:
						"You have entered an invalid password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
					alertTitle: "Invalid Password",
					alertType: "danger",
					showAlert: true,
					isPrimaryBtnFunction: false,
					isSecondaryBtnFunction: false,
				});
				break;
			case "RESPONSE":
				this.setState({
					alertMessage:
						"You have entered an invalid password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
					alertTitle: "Invalid Password",
					alertType: "danger",
					showAlert: true,
					isPrimaryBtnFunction: false,
					isSecondaryBtnFunction: false,
				});
				break;
			case "SIGNIN":
				this.setState({
					alertMessage: message,
					alertTitle: title,
					alertType: "danger",
					showAlert: true,
					isPrimaryBtnFunction: false,
					isSecondaryBtnFunction: false,
				});
				break;
			default:
				this.setState({
					alertMessage: "",
					alertTitle: "",
					alertType: "",
					isPrimaryBtnFunction: false,
					isSecondaryBtnFunction: false,
				});
				break;
		}
	}
	render() {
		const {
			showAlert = false,
			alertMessage = "",
			alertTitle = "",
			alertType = "",
			isPrimaryBtnFunction = false,
			isSecondaryBtnFunction = false,
			isLoading = false,
		} = this.state;
		return (
			<div
				className="appName"
				style={{
					// background: `linear-gradient(rgba(0,123,139,0.7), rgba(255,255,255,0.7))`,
					backgroundImage: `url(/assets/images/bg_login.jpg)`,
					backgroundRepeat: `no-repeat`,
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
				}}>
				<Container className="justify-content-center">
					<Alerts
						title={alertTitle}
						message={alertMessage}
						type={alertType}
						showAlert={showAlert}
						isPrimaryBtnFunction={isPrimaryBtnFunction}
						isSecondaryBtnFunction={isSecondaryBtnFunction}
						secondaryBtnFunctionCallback={(flag) =>
							this.getAlertMessage(flag)
						}
					></Alerts>
					<Row
						xl={3}
						md={2}
						lg={2}
						className="justify-content-center"
					>
						<Col
							style={{
								background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))`,
								paddingBottom: "50px",
								color: 'white',
								borderRadius: '20px'
							}}
						>
							<Form>
								<br />
								<br />
								<h2 className="text-center">
									ClinApp!!!
								</h2>
								<br />
								<br />
								<Form.Group>
									<Form.Label>Email address</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter email"
										value={this.state.email}
										onChange={(e) =>
											this.setState({
												email: e.target.value,
											})
										}
									/>
									<Form.Text className="text-muted">
										We'll never share your email with anyone
										else.
									</Form.Text>
								</Form.Group>
								<Form.Group>
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Password"
										onChange={(e) =>
											this.setState({
												password: e.target.value,
											})
										}
										value={this.state.password}
									/>
								</Form.Group>
								<Form.Group></Form.Group>
								<br />
								<Row className="justify-content-center">
									<Button
										// type="submit"
										onClick={(e)=>this.onSubmit(e)}
										style={{
											width: "250px",
											backgroundColor: Colors.themeBlue,
										}}
										variant="primary"
									>
										{isLoading ? (
											<Spinner
												as="span"
												animation="border"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
										) : (
												`Login`
											)}
									</Button>
								</Row>
								<br />
								<Row className="justify-content-center">
									{/* <Button
										className="g-signin2" data-width="250" data-longtitle="true"
										variant="transparent"
										data-onsuccess={() => this.onSignIn}
										data-onfailure={() => this.onSignIn}>
									</Button> */}
									<GoogleLogin
										clientId="816550823974-t0fgi51cjg3h5kv339efno4gucdo77va.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
										buttonText="Signin with Google"
										style={{
											width: "250px",
											justifyContent: "center",
										}}
										onSuccess={(res)=>this.onGoogleSignIn(res)}
										onFailure={(res) => this.onGoogleSignIn(res)}
									/>
								</Row>
							</Form>
						</Col>
					</Row>
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
	storeUserData
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
