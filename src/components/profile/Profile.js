import React, { Component } from "react";
import {
  Row,
  Col
} from "react-bootstrap";
import { CustomCard } from "../custom-card/CustomCard";
import { FormInputs } from "../formInputs/FormInputs";
import CustomButton from '../custom-Button/CustomButton'
import { storeUserData } from "../../redux-store/actions/userAction";
import { connect } from "react-redux";
import { WhiteBGOpacity } from "../../constants/index"
import {
  updateUserProfile,
  updateUserPassword
} from "../../api-service/index";

class Profile extends Component {
  constructor(props) {
    super(props);
    const { userStore } = props;
    this.state = {
      fname: userStore.fname,
      lname: userStore.lname,
      email: userStore.email,
      contact:userStore.contact,
      password: userStore.password,
      address: userStore.address,
      state: userStore.state,
      country: userStore.country,
      zipcode: userStore.zipcode,
      confirmPassword: "",
      id: userStore.id
    };

    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
    this.onProfileUpdate = this.onProfileUpdate.bind(this);
    this.onPasswordUpdate = this.onPasswordUpdate.bind(this);
  }

  onProfileSubmit = () => {
    // e.preventDefault();
    const { fname, lname, contact, address, state, country, zipcode, id } = this.state
    const profileParams = {
      fname, lname, contact, address, state, country, zipcode, id
    };
    if (!fname.match(/^[A-Za-z]+$/)) {
      // this.setAlertMessages("FNAME");
      alert('Please update your First name correctly')
      return;
    }
    if (!lname.match(/^[A-Za-z]+$/)) {
      // this.setAlertMessages("LNAME");
      alert('Please update your Last name correctly')
      return;
    }
    if (!contact) {
      // /^\d{10}$/
      // this.setAlertMessages("ZIPCODE");
      alert('Please update your contact number correctly')
      return;
    }
    if (
      !contact.match(
        /^\d{10}$/
      )
    ) {
      alert("Please update your contact number correctly")
      return;
    }
    if (!address) {
      // this.setAlertMessages("COUNTRY");
      alert('Please update your address correctly')
      return;
    }
    if (!state.match(/^[A-Za-z]+$/)) {
      // this.setAlertMessages("STATE");
      alert('Please update your State correctly')
      return;
    }
    if (!country.match(/^[A-Za-z]+$/)) {
      // this.setAlertMessages("COUNTRY");
      alert('Please update your country correctly')
      return;
    }
    if (!((zipcode.match(/^\d{5}$/)) || (zipcode.match(/^\d{6}$/)))) {
      // this.setAlertMessages("ZIPCODE");
      alert('Please update your Postal code correctly')
      return;
    }

    this.onProfileUpdate(profileParams);
  }

  onProfileUpdate = async (params) => {
    try {
      const apiResponse = await updateUserProfile(params);
      const {
        data = { status: 400, data: {}, message: "System error" },
      } = apiResponse;
      if (data.status === 200) {
        this.props.storeUserData(data.data);
        alert("Updated Successfully")
      } else {
        alert("There was an error udpating your profile. Please try again")
      }
    } catch (error) {
      alert("Something went wrong. Please try again")
    }
  }

  onPasswordSubmit = () => {
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    const id = this.state.id

    const passwordParams = {
      password, id
    };

    if (password) {
      if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ) {
        // this.setAlertMessages("PASSWORD");
        alert("You have entered an invalid password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
        return;
      }
      if (!confirmPassword) {
        alert("New password should not be blank")
        return;
      }
      if (!(password === confirmPassword)) {
        alert("Please enter the correct value in the confirm password field")
        return;
      }
      this.onPasswordUpdate(passwordParams)
    }
  }
  onPasswordUpdate = async (params) => {
    //call API
    try {
      const apiResponse = await updateUserPassword(params);
      const {
        data = { status: 400, data: {}, message: "System error" },
      } = apiResponse;
      if (data.status === 200) {
        this.props.storeUserData(data.data);
        alert('Password Updated Successfully')
      } else {
        alert("There was an error in updating your password. Please try again.")
      }

    } catch (error) {
      alert("Something went wrong. Please try again")
    }
  }

  render() {

    const { userStore } = this.props;
    const { lname, fname, email, contact, address, state, country, zipcode } = userStore;


    return (
      // <Container style={WhiteBGOpacity}>

      <Row className="p-3 mt-3" style={WhiteBGOpacity}>
        <Col md={12} >
          <CustomCard
            title="Edit Profile"
            content={
              <form>

                <FormInputs
                  ncols={["col-md-5", "col-md-5"]}
                  properties={[
                    {
                      label: "First name",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "First name",
                      defaultValue: fname,
                      onChange: (event) => {
                        this.setState({
                          fname: event.target.value
                        })
                      }
                    },
                    {
                      label: "Last name",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "Last name",
                      defaultValue: lname,
                      onChange: (event) => {
                        this.setState({
                          lname: event.target.value
                        })
                      }
                    }
                  ]}
                />
                <FormInputs
                  ncols={["col-md-5", "col-md-5"]}
                  properties={[
                    {
                      label: "Contact",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "Contact Number",
                      defaultValue: contact,
                      onChange: (event) => {
                        this.setState({
                          contact: event.target.value
                        })
                      }
                    },
                    {
                      label: "Email address",
                      type: "email",
                      bsclass: "form-control",
                      placeholder: "Email",
                      defaultValue: email,
                      disabled: true
                      // onChange: (event) => {
                      //   this.setState({
                      //     email: event.target.value
                      //   })
                      // }
                    }
                  ]}
                />
                <FormInputs
                  ncols={["col-md-10"]}
                  properties={[
                    {
                      label: "Adress",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "Home Adress",
                      defaultValue: address,
                      onChange: (event) => {
                        this.setState({
                          address: event.target.value
                        })
                      }
                    }
                  ]}
                />
                <FormInputs

                  ncols={["col-md-4", "col-md-4", "col-md-4"]}
                  properties={[
                    {
                      label: "State",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "State",
                      defaultValue: state,
                      onChange: (event) => {
                        this.setState({
                          state: event.target.value
                        })
                      }
                    },
                    {
                      label: "Country",
                      type: "text",
                      bsclass: "form-control",
                      placeholder: "Country",
                      defaultValue: country,
                      onChange: (event) => {
                        this.setState({
                          country: event.target.value
                        })
                      }
                    },
                    {
                      label: "Postal Code",
                      type: "number",
                      bsclass: "form-control",
                      placeholder: "Zipcode",
                      defaultValue: zipcode,
                      onChange: (event) => {
                        this.setState({
                          zipcode: event.target.value
                        })
                      }
                    }
                  ]}
                />


                <CustomButton bsStyle="info" pullRight fill type="submit" text="Update Profile"
                  onCustomButtonClick={() => {
                    this.onProfileSubmit()
                  }}
                // onSubmit={(e) =>
                // this.onProfileSubmit()
                // }
                />


                <hr />
                <FormInputs
                  // handlePrimaryBtn={this.handlePrimaryBtn()}
                  // onChange={(e) =>
                  //   this.setState({
                  //     password: e.target.value,
                  //   })
                  // }
                  ncols={["col-md-5", "col-md-5"]}
                  properties={[
                    {
                      label: "New Password",
                      type: "string",
                      bsclass: "form-control",
                      placeholder: "Please enter your new Password",
                      defaultValue: "",
                      onChange: (event) => {
                        this.setState({
                          password: event.target.value
                        })
                      }
                    },
                    {
                      label: "Confirm Password",
                      type: "string",
                      bsclass: "form-control",
                      placeholder: "Please confirm your password",
                      defaultValue: "",
                      onChange: (event) => {
                        this.setState({
                          confirmPassword: event.target.value
                        })
                      }
                    }
                  ]}
                />

                <CustomButton bsStyle="info" pullRight fill type="submit" text="Update Password"
                  onCustomButtonClick={() => {
                    this.onPasswordSubmit()
                  }}
                />
              </form>
            }
          />
        </Col>
        <Col md={4}>

        </Col>
      </Row>
      // </Container>

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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
