import { apiClient } from "./axios";


export const signin = params => {
    return apiClient({
        method: "GET",
        url: `/users/signin`,
        params,
        //data: {email, password}
    });
};

export const signup = (params) => {
    return apiClient({
      method: "POST",
      url: `/users/signup`,
      params,
      //data: {email, password}
    });
  };
  
export const signinWithGoogle = params => {
    return apiClient({
        method: "GET",
        url: `/users/signinWithGoogle`,
        params,
        //data: {email, password}
    });
};

export const addAppointment = params => {
    return apiClient({
        method: "POST",
        url: `/appointments/add-patient-appointments`,
        params,
        //data: {email, password}
    });
};

export const getDoctorsDetails = data => {

    let params = {"where":{ "id":data.createdby}}
    return apiClient({
        method: "GET",
        url: `/users/findOne`,
        params,
        //data: {email, password}
    });
};


export const getPatientsLastNextAppointments = params => {
    return apiClient({
        method: "GET",
        url: `/appointments/get-patients-last-next-appointments`,
        params,
        //data: {email, password}
    });
};

export const updatePayment = params => {
    return apiClient({
        method: "POST",
        url: `/appointments/update-payment-details`,
        params,
        //data: {email, password}
    });
};

export const patientsPendingAppointments = params => {
    return apiClient({
        method: "GET",
        url: `/appointments/get-patients-appointments`,
        params,
        //data: {email, password}
    });
};


export const checkinPatientsAppointment = params => {
    return apiClient({
        method: "POST",
        url: `/appointments/patients-appointment-checkin`,
        params,
        //data: {email, password}
    });
};

export const updateUserProfile = params => {
    return apiClient({
        method: "POST",
        url: `/users/update-user-profile`,
        params,
        //data: {email, password}
    });
};
export const updateUserPassword = params => {
    return apiClient({
        method: "POST",
        url: `/users/user-password-update`,
        params,
        //data: {email, password}
    });
};
export const getPatientAppointmentHistory = params => {
    return apiClient({
        method: "GET",
        url: `/appointments/get-patients-appointments`,
        params,
        //data: {email, password}
    });
}
export const getDoctorsNextAppointment = params => {
    return apiClient({
        method: "GET",
        url: `/appointments/get-doctors-todays-next-appointments`,
        params,
        //data: {email, password}
    });
};
export const getDoctorsPendingPaymentList = params => {
    return apiClient({
        method: "GET",
        url: `/appointments/get-pending-payments-for-doctor`,
        params,
        //data: {email, password}
    });
};
export const sendAppointmentReminder = params => {
    return apiClient({
        method: "POST",
        url: `/appointments/send-appointment-reminder`,
        params,
        //data: {email, password}
    });
};