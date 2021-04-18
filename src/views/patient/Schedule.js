import React, { Component } from "react";
// import logo from "./logo.svg";
import Appointment from "./AddAppointment.js";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import "./App.css";

class Schedule extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Appointment />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Schedule;
