import React, { Component } from "react";
import { Container, Jumbotron } from "react-bootstrap";
import CustomButton from "../custom-Button/CustomButton";
import { WhiteBGOpacity } from "../../constants/index";


class CustomJumbotron extends Component {
	render() {
        const { fname="User", doctorName="User Doctor", utype ="PATIENT"} = this.props; //onCustomButtonClick
		return (
			<Container className="mt-2">
                {
                    (utype === "PATIENT") 
                    ?
                    <Jumbotron
                        style={WhiteBGOpacity}>
                        <h1>Hello, {fname}</h1>
                        <p>
                            You have been assigned Dr. {doctorName} for your Dental
                            Treatment. Dr {doctorName} completed his MBBS from India and
                            his Masters degree from Northeastern University. With 35
                            years of experience in this treating patients all across
                            the globe, it is rest assured that have been placed in
                            safe hands. So, go ahead and schedule your appointment
                            now.
                        </p>
                        <hr className="my-2" />
                        <p>
                            <CustomButton text={"Book Now"} onCustomButtonClick={()=>{
                                if(this.props.onCustomButtonClick){
                                    this.props.onCustomButtonClick();
                                }
                            }} />
                        </p>
                    </Jumbotron>
                    : 
                    <Jumbotron
                        style={WhiteBGOpacity}>
                        <h1>Hello, Dr. {fname}</h1>
                        <p>
                            Hope your doing well. Let's spread some more healthy smiles today.
                        </p>
                        <hr className="my-2" />
                        <p>
                            <CustomButton text={"Add Patient"} onCustomButtonClick={()=>{
                                if(this.props.onCustomButtonClick){
                                    this.props.onCustomButtonClick();
                                }
                            }} />
                        </p>
                    </Jumbotron>

                }
				
			</Container>
		);
	}
}

export default CustomJumbotron;
