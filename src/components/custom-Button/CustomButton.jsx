import {Button} from 'react-bootstrap';
import {Colors} from '../../constants/index';
import React from "react";


export class CustomButton extends React.Component {
    render() {
      const { isDisabled=false} = this.props;
      return (
        <Button style={{ backgroundColor: `${Colors.cyan}` }} disabled={isDisabled} onClick={ ()=>{
          if(this.props.onCustomButtonClick){
            this.props.onCustomButtonClick();
          }
        }}>
            {this.props.text}
        </Button>
      )
    }
}

export default CustomButton;
