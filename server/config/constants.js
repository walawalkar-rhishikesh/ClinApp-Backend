/* eslint-disable */
module.exports = {
    jwtConst:{
        privatekey: "ThisIsClinApp"
    },
    bcryptConst : {
        salt: 15
    },
    userTypes: {
        patient: "PATIENT",
        doctor: "DOCTOR",
        staff: "STAFF"
    },
    nodeMailerConst:{
        userCreationViaInvite: (fname) => {
            let subject = `Welcome to ClinApp`;
            let text = `Hi ${fname} \nThank you for visiting our clinic. Your account has been successfully created. Please login with your registered email id. Your default password is clinApp@91674144. \nYou can now book your further appointments on our website. \nBest \nTeam ClinApp `
            return { subject , text};
        },
        appointmentCreation: (fname, time) => {
            let subject = `ClinApp: Appointment Confirmation`;
            let text = `Hi ${fname} \nThank you for using ClinApp. Your appointment has been successfully scheduled for ${time}. Please login with your registered email id and your password for further details. \nBest \nTeam ClinApp `
            return { subject , text};
        },
        paymentReminder: (fname, time, amount) => {
            let subject = `ClinApp: Payment Reminder`;
            let text = `Hi ${fname} \nThank you for using ClinApp. Your payment for the appointment on ${time} of $ ${amount} is pending. Please login with your registered email id and your password to make the payments. \nBest \nTeam ClinApp `
            return { subject , text};
        },
        passwordChange: (fname) => {
            let subject = `ClinApp: Password Updation Alert`;
            let text = `Hi ${fname} \nPassword for your account has been updated successfully. Please login with your new credentials. \nBest \nTeam ClinApp `
            return { subject , text};
        }
    }
}