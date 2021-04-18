import { postUserData,logoutAction } from "../actions/userAction";

const initialState = {
	accessToken: "",
	createdby: "",
	createdon: "",
	email: "",
	fname: "",
	isActive: "",
	isDeleted: "",
	lname: "",
	password: "",
	updatedon: "",
	utype: "",
	contact: "",
	address: "",
	zipcode: "",
	state: "",
	country: "",
	id: "",
};

function userReducers(state = initialState, action) {
	switch (action.type) {
		case postUserData:
			return {
				accessToken: action.accessToken,
				createdby: action.createdby,
				createdon: action.createdon,
				email: action.email,
				fname: action.fname,
				isActive: action.isActive,
				isDeleted: action.isDeleted,
				lname: action.lname,
				password: action.password,
				updatedon: action.updatedon,
				utype: action.utype,
				contact: action.contact,
				address: action.address,
				zipcode: action.zipcode,
				state: action.state,
				country: action.country,
				id: action.id,
			};
		case logoutAction:
			return {
				initialState
			};
		default:
			return state;
	}
}

export default userReducers;
