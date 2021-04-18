import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./layouts/Auth";
import Patient from "./layouts/Patient";
import Doctor from "./layouts/Doctor"
import { connect } from "react-redux";

import RouterConfig from "./config/router"

class App extends Component {

	constructor(props){
		super(props);
		this.checkLoginStatus = this.checkLoginStatus.bind(this);
	}
	getLoginStatus = () => {
		
		const { userStore } = this.props;
		const { utype='' } = userStore;
		if(utype === 'PATIENT'){
			return <Redirect from="/" to={RouterConfig.patient.main} />
		}
		if(utype === 'DOCTOR'){
			return <Redirect from="/" to={RouterConfig.doctor.main} />
		}
		else{
			return <Redirect from="/" to={RouterConfig.signin} />
		}
	};

	checkLoginStatus = () =>{
		const { userStore } = this.props;
		const { utype } = userStore;
		if (!utype) {
			return false;
		}
		return true;
	}


	render() {
		return (
			<BrowserRouter>
			
				<Switch>
					<Route
						path={RouterConfig.signin}
						render={(props) => <Auth {...props} />}
					/>
					<Route
						path={RouterConfig.patient.main}
						render={(props) => {
							if(this.checkLoginStatus()){
								return <Patient {...props} />
							}else{
								return <Redirect to={RouterConfig.signin}/>
							}
						}}
					/>
					<Route
						path={RouterConfig.doctor.main}
						render={(props) => {
							if(this.checkLoginStatus()){
								return <Doctor {...props} />
							}else{
								return <Redirect to={RouterConfig.signin}/>
							}
						}}
					/>
					{this.getLoginStatus()}
				</Switch>
			</BrowserRouter>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		userStore: state.user,
	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
