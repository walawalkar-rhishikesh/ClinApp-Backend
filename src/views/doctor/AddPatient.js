import React, { Component } from "react";
import {
  Form,
  Container,
  Row,
  Card,
  Col,
} from "react-bootstrap";
import { connect } from "react-redux";
import { storeUserData } from "../../redux-store/actions/userAction";

import "../patient/Home.css";
import { WhiteBGOpacity } from "../../constants";
import ConfigRouter from "../../config/router";
import CustomButton from "../../components/custom-Button/CustomButton";
import { signup } from "../../api-service/index";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      lastname: "",
      email: "",
    };
  }

  submit() {
    if (!this.state.name) {
      alert("Please enter first name");
      return;
      // }else if(!(regex.test(this.state.name) )){
    } else if (!this.state.name.match(/^[a-zA-Z ]*$/)) {
      alert("Firstname should start with letters");
    } else if (!this.state.lastname.match(/^[a-zA-Z ]*$/)) {
      alert("Lastname should start with letters");
    } else if (!this.state.lastname) {
      alert("Please enter last name");
      return;
    } else if (!this.state.email) {
      alert("Please enter email id");
      return;
    } else if (!this.state.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter valid email");
      return;
    } else {
      this.addPatient();
    }
  }
  componentDidMount() {}

  addPatient = async (body) => {
    const { userStore } = this.props;
    const { id } = userStore;
    const { name, lastname, email } = this.state;
    let params = {
      fname: name,
      lname: lastname,
      email: email,
      password: null,
      utype: "PATIENT",
      createdby: id,
      isInvite: true,
    };
    try {
      const apiResponse = await signup(params);
      const {
        data = { status: 400, data: {}, message: "System error" },
      } = apiResponse;

      if (data.status === 200) {
        alert(data.message);
        this.props.history.push(ConfigRouter.doctor.main);
      } else if (data.status === 400) {
        alert(data.message);
      }
    } catch (error) {
      alert("Please try again.");
    } finally {
      // alert("finally condition is running")
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-between my-3">
          <Col>
            <Card col={2} className="text-center" style={WhiteBGOpacity}>
              <Card.Header>
                <h2>Patient Form</h2>
              </Card.Header>

              <Card.Body>
                <h5>Please enter all the details</h5>
                  <Form>
                    <Form.Row>
                      <Col>
                        <Form.Control
                          name="name"
                          placeholder="First name"
                          onChange={(e) =>
                            this.setState({
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          name="lastname"
                          placeholder="Last name"
                          onChange={(e) =>
                            this.setState({
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Form.Row>
                    <br />
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                      <Col sm={12}>
                        <Form.Control
                          name="email"
                          type="email"
                          placeholder="Email"
                          onChange={(e) =>
                            this.setState({
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </Col>
                    </Form.Group>
                  </Form>
                <Row>
                  <div className="m-3">
                    <CustomButton
                      text={"Submit"}
                      onCustomButtonClick={() => this.submit()}

                      // onCustomButtonClick={() => {
                      // 	this.props.history.push(
                      // 		ConfigRouter.patient.addAppointments
                      // 	);
                      // }}
                    />
                  </div>
                  <div className="m-3">
                    <CustomButton
                      text={"Cancel"}
                      onCustomButtonClick={() => {
                        this.props.history.push(
                          ConfigRouter.doctor.appointments
                        );
                      }}
                    />
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* <BottomNavigation/> */}
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
