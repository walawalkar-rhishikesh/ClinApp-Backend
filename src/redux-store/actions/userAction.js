export const postUserData = "postUserData";
export const logoutAction = "logoutAction";

export function storeUserData(
	data
) {
	return {
		type: postUserData,
		accessToken: data.accessToken,
		createdby: data.createdby,
		createdon: data.createdon,
		email: data.email,
		fname: data.fname,
		isActive: data.isActive,
		isDeleted: data.isDeleted,
		lname: data.lname,
		password: data.password,
		updatedon: data.updatedon,
		utype: data.utype,
		contact:data.contact,
		address:data.address,
		zipcode:data.zipcode,
		state:data.state,
		country:data.country,
		id:data.id,
	};
}

export function logout(
	data
) {
	return {
		type: logoutAction
	};
}
