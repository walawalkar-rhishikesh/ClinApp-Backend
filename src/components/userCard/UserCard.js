import React, { Component } from "react";
import { Container, Card } from "react-bootstrap";

export class UserCard extends Component {
    render() {
        return (
            //   <div className="card card-user">
            //     {/* <div className="image">
            //       <img src={this.props.bgImage} alt="..." />
            //     </div> */}
            //     <div className="content">
            //       <div className="author">
            //         <a href="#pablo">
            //           <img
            //             className="avatar border-gray"
            //             src={this.props.avatar}
            //             alt="..."
            //           />
            //           <h4 className="title">
            //             {this.props.name}
            //             <br />
            //             <small>{this.props.userName}</small>
            //           </h4>
            //         </a>
            //       </div>
            //       <p className="description text-center">{this.props.description}</p>
            //     </div>
            //     <hr />
            //     <div className="text-center">{this.props.socials}</div>
            //   </div>

            <Container fluid>
                <Card style={{ width: '18rem' }} className="text-center">
                    <Card.Img variant="top" src={this.props.avatar} />
                    <Card.Body>
                        <Card.Title className="justify-content-center">{this.props.name}</Card.Title>
                        <Card.Text className="justify-content-center">
                            {this.props.userName}
                        </Card.Text>
                        {/* <Button variant="primary">Go somewhere</Button> */}
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default UserCard;