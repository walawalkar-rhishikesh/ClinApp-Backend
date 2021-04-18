import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import routes from "../config/router/doctor";
import BottomNavigation from "../components/bottom-navigation/Bottom-Navigation"
import { connect } from "react-redux";
import { storeUserData } from "../redux-store/actions/userAction";

import RouterConfig from "../config/router";
import Header from "../components/header/Header";
import { Parallox } from "../constants";
import { Navbar } from "react-bootstrap"

class Doctor extends Component {
	getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === RouterConfig.doctor.main) {
				return (
					<Route
						path={prop.path}
						render={(props) => (
							<prop.component
								{...props}
							// handleClick={this.handleNotificationClick}
							/>
						)}
						key={key}
					/>
				);
			} else {
				return null;
			}
		});
	};
	render() {
		return (
			<div style={Parallox}>
				<Header />
				<Switch>
					{this.getRoutes(routes)}
					<Redirect
						from={RouterConfig.doctor.main}
						to={RouterConfig.doctor.home}
					/>
				</Switch>
				<Navbar fixed='bottom' className=" container center justify-content-center">
					<BottomNavigation />
				</Navbar>
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
	storeUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
