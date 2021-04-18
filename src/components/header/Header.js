import { Nav, Navbar } from "react-bootstrap";
import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import RouterConfig from "../../config/router"
import { WhiteBGOpacity } from "../../constants"
import {logout} from "../../redux-store/actions/userAction"
class Header extends React.Component {
    // https://react-bootstrap.github.io/components/navbar/ Header example
	render() {
        const { userStore} = this.props;
        const{ fname, utype} = userStore;
        let router = {}
        if(utype === "DOCTOR"){
            router = RouterConfig.doctor;
        }
        if(utype === "PATIENT"){
            router = RouterConfig.patient;
        }
        return(
            <Navbar collapseOnSelect expand="lg" bg="muted" style={WhiteBGOpacity}  >
            {/* <Navbar collapseOnSelect expand="lg" bg="info" style={{ backgroundColor : `rgba(255,255,255,0.6)`}} > */}
                <Navbar.Brand className="text-info" href={router.main}>CLINAPP</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href={router.home}>Home</Nav.Link>
                        <Nav.Link href={router.appointments}>Appointments</Nav.Link>
                        {/* <Nav.Link href="">Payments</Nav.Link> */}
                    </Nav>
                    <Nav>
                        <Nav.Link href="" onClick={()=>{
                            this.props.logout();
                            window.location.href = RouterConfig.signin;
                        }}>
                            <FontAwesomeIcon icon={faSignOutAlt}/>  Logout
                        </Nav.Link>
                        <Nav.Link className="text-info" href={router.profile}>
                            <FontAwesomeIcon icon={faUser} /> {fname.toUpperCase()}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
		    </Navbar>
        )
		;
	}
}
const mapStateToProps = (state) => {
	return {
		userStore: state.user,
	};
};
const mapDispatchToProps = {logout};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
