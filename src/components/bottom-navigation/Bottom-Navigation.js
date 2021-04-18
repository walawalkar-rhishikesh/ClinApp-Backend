import React, { Component } from "react";
import "./bottom-navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RouterConfig from "../../config/router"

import { connect } from "react-redux";
import {logout} from "../../redux-store/actions/userAction"
import {
	faHome,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
	faAddressBook
} from "@fortawesome/free-regular-svg-icons";

class BottomNavigation extends Component {
	constructor() {
		super();
		this.state = {
			showForm: false,
		};
	}

	showForm() {
		this.setState({
			showForm: !this.state.showForm,
		});
	}

	render() {
        const { userStore} = this.props;
        const{ utype} = userStore;
        let router = {}
        if(utype === "DOCTOR"){
            router = RouterConfig.doctor;
        }
        if(utype === "PATIENT"){
            router = RouterConfig.patient;
        }
        let links = [
			{ label: faHome, link: router.main },
			{ label: faAddressBook, link: router.appointments },
			{ label: faSignOutAlt, link: RouterConfig.signin },
		];
		let linksMarkup = links.map((link, index) => {
			let linkMarkup = link.active ? (
				<a className="menu__link menu__link--active" href={link.link}>
					{link.label}
				</a>
			) : (
				<a className="menu__link" href={link.link} onClick={()=>{
                    if(link.link === RouterConfig.signin) this.props.logout()
                }}>
					<FontAwesomeIcon
						className="fa-3x zoom "
						style={{ color: "#408697" }}
						icon={link.label}
					/>
				</a>
			);
			return (
				<li key={index} className="menu__list-item">
					{linkMarkup}
				</li>
			);
		});

		return (
			<div>
				<nav className="menu">
					<div className="menu__right">
						<ul className="menu__list">{linksMarkup}</ul>
					</div>
				</nav>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		userStore: state.user,
	};
};
const mapDispatchToProps = {logout};
export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigation);