import React, { Component } from "react";
import Profile from '../../components/profile/Profile'
import { Container } from "react-bootstrap";

class UserProfile extends Component {
    
  render() {
    return(
      <Container>
<Profile/>
      </Container>
      
    );
    
  }
}
export default UserProfile;
