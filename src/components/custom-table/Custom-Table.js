import {Container, Table} from 'react-bootstrap';
// import {Colors} from '../../constants/index';
import React from "react";
// import CustomButton from "../custom-Button/CustomButton"
// import ConfigRouter from "../../config/router"
import {WhiteBGOpacity} from "../../constants"


export class customTable extends React.Component {
    render() {
      return (
          <Container>
             <Table responsive="sm" style={WhiteBGOpacity}>
					
					<thead>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr  className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
							<td>1</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
						
								
						</tr>
						<tr className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
							<td>2</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							
						</tr>
						<tr className="rounded justify-content-between my-3 m2 shadow-sm p-4 mb-4 bg-white">
							<td>3</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							<td>Table cell</td>
							
						</tr>
					</tbody>
				</Table>
          </Container>
        
      )
    }
}

export default customTable;