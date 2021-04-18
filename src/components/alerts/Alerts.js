import Alert from "react-bootstrap/Alert";
import React from "react";
import { Button } from "react-bootstrap";
import PropTypes from 'prop-types';

class Alerts extends React.Component {
	constructor(props) {
		super(props);
		this.handlePrimaryBtn = this.handlePrimaryBtn.bind(this);
		this.handleSecondaryBtn = this.handleSecondaryBtn.bind(this);
	}
	componentDidMount(){
		const { showAlert } = this.props;
		this.setState({
			showAlert
		})
	}
	
	handlePrimaryBtn(){
		const {
			primaryBtnFunctionCallback
		} = this.props;
		if( primaryBtnFunctionCallback){
			primaryBtnFunctionCallback();
		}
	}
	handleSecondaryBtn(){
		const {
			secondaryBtnFunctionCallback
		} = this.props;
		if( secondaryBtnFunctionCallback){
			secondaryBtnFunctionCallback(false);
		}
	}
	render() {
		const {
			type,
			title,
			message,
			isPrimaryBtnFunction = false,
			isSecondaryBtnFunction = false,
			showAlert = false
		} = this.props;

		return (
			<Alert style={{position: 'absolute',top: 0,right: 0,left: 0,zIndex: 1}} variant={type} show={showAlert} onClose={() => this.handleSecondaryBtn()} dismissible>
				<Alert.Heading>{title}</Alert.Heading>
				<p>
				{message}
				</p>
				{
					isPrimaryBtnFunction && <Button variant="info" onClick={this.handlePrimaryBtn}>Confirm</Button> 
				}
				{"  "}
				{
					isSecondaryBtnFunction && <Button variant="light" onClick={this.handleSecondaryBtn}>Cancel</Button>
				}
			</Alert>
		);
	}
}
Alerts.defaultProps = {
	type: "success",
	title: "",
	message: "",
	showAlert: false,
	isPrimaryBtnFunction: false,
	isSecondaryBtnFunction: false,
	// primaryFunctionCallback: ''
	// secondaryFunctionCallback: ''
};

Alerts.propTypes = {
	type: PropTypes.string,
	title: PropTypes.string,
	message: PropTypes.string,
	showAlert: PropTypes.bool,
	isPrimaryBtnFunction: PropTypes.bool,
	isSecondaryBtnFunction: PropTypes.bool,
	primaryBtnFunctionCallback: PropTypes.func,
	secondaryBtnFunctionCallback: PropTypes.func,
};

export default Alerts;
