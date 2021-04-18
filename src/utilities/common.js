import moment from "moment";

// const kelvinToFahrenheit = (value) => {
// 	return Math.floor(value * (9 / 5) - 459.67);
// };
// const getDayFromADate = (date) => {
// 	let days = [
// 		"Sunday",
// 		"Monday",
// 		"Tuesday",
// 		"Wednesday",
// 		"Thursday",
// 		"Friday",
// 		"Saturday",
// 	];
// 	return days[new Date(date.split(" ")[0]).getDay()];
// };
const convertDate = (date) => {
	return moment(date).local().format("YYYY-MM-DD HH:mm");
};

export default {convertDate }
