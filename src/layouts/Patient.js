import React, { Component,  } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import routes from "../config/router/patient";
import { connect } from "react-redux";
import { storeUserData } from "../redux-store/actions/userAction";

import RouterConfig from "../config/router";
import Header from "../components/header/Header";
import { Parallox } from "../constants"
//import { BottomNavigation } from "material-ui";
import BottomNavigation from "../components/bottom-navigation/Bottom-Navigation"
import {Navbar}  from "react-bootstrap"

class Patient extends Component {
	getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === RouterConfig.patient.main) {
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
						from={RouterConfig.patient.main}
						to={RouterConfig.patient.home}
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

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
