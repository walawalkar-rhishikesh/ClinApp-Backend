// "use strict";
/* eslint-disable */

var moment = require("moment");
var async = require("async");

let {
  mstatus,
  msuccess,
  merror,
} = require("../../server/config/http-messages");

var mresponseSuccess = {
  status: mstatus.success,
  message: msuccess.success,
  data: {},
};
var mresponseError = {
  status: mstatus.error,
  message: merror.request,
  data: {},
};

module.exports = function (Appointments) {
  Appointments.remoteMethod("getPatientsAppointments", {
    http: { path: "/get-patients-appointments", verb: "get" },
    description: "This API is used to get patients appointment",
    accepts: [
      {
        arg: "patient_id",
        type: "string",
        required: true,
      },
      {
        arg: "onlyPendingPayment",
        type: "boolean",
        default: "false",
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.getPatientsAppointments = function (
    patient_id,
    onlyPendingPayment,
    accessToken,
    callback
  ) {
    if (!patient_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (!onlyPendingPayment) onlyPendingPayment = false;
    var query = { where: { patient_id }, order: ["start_time DESC"] };
    if (onlyPendingPayment) {
      query.where.payment_status = "PENDING";
    }
    Appointments.find(query, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.length > 0) {
        mresponseSuccess.message = msuccess.success;
        mresponseSuccess.data = response;
        callback(null, mresponseSuccess);
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
        return;
      }
    });
  };
  Appointments.remoteMethod("getDoctorsAppointments", {
    http: { path: "/get-doctors-appointments", verb: "get" },
    description: "This API is used to get doctors appointment",
    accepts: [
      {
        arg: "doctor_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.getDoctorsAppointments = function (
    doctor_id,
    accessToken,
    callback
  ) {
    if (!doctor_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    Appointments.find(
      { where: { doctor_id }, order: ["start_time DESC"] },
      (err, response) => {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else if (response && response.length > 0) {
          mresponseSuccess.message = msuccess.success;
          mresponseSuccess.data = response;
          callback(null, mresponseSuccess);
        } else {
          mresponseError.message = merror.no_records;
          callback(null, mresponseError);
          return;
        }
      }
    );
  };

  Appointments.remoteMethod("addPatientAppointments", {
    http: { path: "/add-patient-appointments", verb: "post" },
    description: "This API is used to add appointments",
    accepts: [
      {
        arg: "doctor_id",
        type: "string",
        required: true,
      },
      {
        arg: "patient_id",
        type: "string",
        required: true,
      },
      {
        arg: "appoinment_date",
        type: "date",
        required: true,
      },
      {
        arg: "start_time",
        type: "date",
        required: true,
      },
      {
        arg: "end_time",
        type: "date",
        required: true,
      },
      {
        arg: "total_price",
        type: "number",
        default: 150,
        required: true,
      },
      {
        arg: "service_type",
        type: "string",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.addPatientAppointments = function (
    doctor_id,
    patient_id,
    appoinment_date,
    start_time,
    end_time,
    total_price,
    service_type,
    callback
  ) {
    if (!doctor_id) {
      mresponseError.message = "Invalid Doctor";
      callback(null, mresponseError);
      return
    }
    if (!patient_id) {
      mresponseError.message = "Invalid Patient";
      callback(null, mresponseError);
      return
    }
    if (!appoinment_date) {
      mresponseError.message = "Invalid appointment date";
      callback(null, mresponseError);
      return
    }
    if (!start_time) {
      mresponseError.message = "Invalid start time";
      callback(null, mresponseError);
      return
    }
    if(!moment().isBefore(moment(start_time))){
      mresponseError.message = "Invalid start time. Appointment bookings are allowed for future timing only.";
      callback(null, mresponseError);
      return
    }

    if (!end_time) {
      mresponseError.message = "Invalid end time";
      callback(null, mresponseError);
      return
    }
    if (total_price < 0) {
      mresponseError.message = "Invalid price";
      callback(null, mresponseError);
      return
    }
    if (!service_type) {
      mresponseError.message = "Invalid service";
      callback(null, mresponseError);
      return
    }
    Appointments.find(
      {
        where: {
          doctor_id,
          appoinment_date,
          start_time,
          end_time,
          isCancelled: false,
        },
      },
      function (err, response) {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else if (response && response.length == 0) {
          Appointments.create(
            {
              doctor_id,
              patient_id,
              appoinment_date: new Date(appoinment_date),
              start_time: new Date(start_time),
              end_time: new Date(end_time),
              isCancelled: false,
              status: "SCHEDULED",
              total_price,
              payment_status: "PENDING",
              service_type,
              createdon: new Date(),
              updatedon: new Date(),
            },
            (err, response) => {
              if (err) {
                mresponseError.message = err;
                callback(null, mresponseError);
              } else if (response) {
                Appointments.app.models.users.sendAppointmentCreationNotification(
                  patient_id,
                  moment(start_time).local()
                );
                mresponseSuccess.message = msuccess.success;
                mresponseSuccess.data = response;
                callback(null, mresponseSuccess);
              } else {
                mresponseError.message = merror.database;
                callback(null, mresponseError);
                return;
              }
            }
          );
        } else {
          mresponseError.message = merror.appointment_already;
          callback(null, mresponseError);
          return;
        }
      }
    );
  };
  Appointments.remoteMethod("getPatientsLastNextAppointments", {
    http: { path: "/get-patients-last-next-appointments", verb: "get" },
    description: "This API is used to get patients last next appointments",
    accepts: [
      {
        arg: "patient_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.getPatientsLastNextAppointments = function (
    patient_id,
    accessToken,
    callback
  ) {
    if (!patient_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    async.parallel(
      {
        previous: function (cb) {
          let req = {
            where: {
              and: [{ start_time: { lte: new Date() } }, { patient_id }],
            },
            order: ["start_time DESC"],
          };
          Appointments.find(req, (error, res) => {
            if (error) {
              cb(null, []);
            } else {
              cb(null, res);
            }
          });
        },
        next: function (cb) {
          let req2 = {
            where: {
              and: [{ start_time: { gte: new Date() } }, { patient_id }],
            },
            order: ["start_time DESC"],
          };
          Appointments.find(req2, (error, res) => {
            if (error) {
              cb(null, []);
            } else {
              cb(null, res);
            }
          });
        },
      },
      function (err, results) {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else {
          mresponseSuccess.message = msuccess.success;
          mresponseSuccess.data = results;
          callback(null, mresponseSuccess);
        }
      }
    );
  };
  Appointments.remoteMethod("patientsAppointmentCheckin", {
    http: { path: "/patients-appointment-checkin", verb: "post" },
    description: "This API is used to put patients appointment checkin",
    accepts: [
      {
        arg: "patient_id",
        type: "string",
        required: true,
      },
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.patientsAppointmentCheckin = function (
    patient_id,
    id,
    accessToken,
    callback
  ) {
    if (!patient_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (!id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    Appointments.findOne(
      {
        where: { and: [{ id }, { patient_id }] },
      },
      (err, response) => {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else if (response) {
          // mresponseSuccess.message = msuccess.success;
          // mresponseSuccess.data = response;
          // callback(null, mresponseSuccess);
          var result = response;
          result.status = "CHECKEDIN";
          result.checked_in_time = new Date();
          result.updatedon = new Date();
          response.updateAttributes(result, (response) => {
            Appointments.app.models.users.sendAppointmentPaymentNotification(
              patient_id,
              moment(result.appoinment_date).local(),
              result.total_price
            );
            mresponseSuccess.message = msuccess.success;
            mresponseSuccess.data = result;
            callback(null, mresponseSuccess);
          });
        } else {
          mresponseError.message = merror.no_records;
          callback(null, mresponseError);
          return;
        }
      }
    );
  };

  Appointments.remoteMethod("getDoctorsTodaysNextAppointments", {
    http: { path: "/get-doctors-todays-next-appointments", verb: "get" },
    description: "This API is used to get patients last next appointments",
    accepts: [
      {
        arg: "doctor_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.getDoctorsTodaysNextAppointments = function (
    doctor_id,
    accessToken,
    callback
  ) {
    if (!doctor_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    async.parallel(
      {
        today: function (cb) {
          var start = new Date();
          start.setHours(0, 1, 1);

          var end = new Date();
          end.setHours(23, 59, 59);
          let req = {
            where: {
              and: [{ start_time: { between: [start, end] } }, { doctor_id }],
            },
            order: ["start_time DESC"],
          };
          Appointments.find(req, (error, res) => {
            if (error) {
              cb(null, []);
            } else {
              cb(null, res);
            }
          });
        },
        tomorrow: function (cb) {
          var start1 = new Date();
          start1.setDate(start1.getDate() + 1);
          start1.setHours(0, 1, 1);

          var end1 = new Date();
          end1.setDate(end1.getDate() + 1);
          end1.setHours(23, 59, 59);

          let req2 = {
            where: {
              and: [{ start_time: { between: [start1, end1] } }, { doctor_id }],
            },
            order: ["start_time DESC"],
          };
          Appointments.find(req2, (error, res) => {
            if (error) {
              cb(null, []);
            } else {
              cb(null, res);
            }
          });
        },
      },
      function (err, results) {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else {
          mresponseSuccess.message = msuccess.success;
          mresponseSuccess.data = results;
          callback(null, mresponseSuccess);
        }
      }
    );
  };

  Appointments.remoteMethod("getPendingPaymentsForDoctor", {
    http: { path: "/get-pending-payments-for-doctor", verb: "get" },
    description: "This API is used to get Pending Payments For Doctor",
    accepts: [
      {
        arg: "doctor_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.getPendingPaymentsForDoctor = function (
    doctor_id,
    accessToken,
    callback
  ) {
    if (!doctor_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    var query = {
      where: {
        and: [
          { doctor_id },
          { payment_status: "PENDING" },
          { start_time: { lte: new Date() } },
        ],
      },
      order: ["start_time DESC"],
    };

    Appointments.find(query, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.length > 0) {
        mresponseSuccess.message = msuccess.success;
        mresponseSuccess.data = response;
        callback(null, mresponseSuccess);
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
        return;
      }
    });
  };

  Appointments.remoteMethod("sendAppointmentReminder", {
    http: { path: "/send-appointment-reminder", verb: "POST" },
    description: "This API is used to send Appointment Reminder",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "patient_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.sendAppointmentReminder = function (
    id,
    patient_id,
    accessToken,
    callback
  ) {
    if (!id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (!patient_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    Appointments.findOne({where:{id}}, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response) {
        var result = response;
        Appointments.app.models.users.sendAppointmentPaymentNotification(
          patient_id,
          moment(result.appoinment_date).local().toString(),
          result.total_price
        );
        mresponseSuccess.message = msuccess.success;
        mresponseSuccess.data = response;
        callback(null, mresponseSuccess);
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
        return;
      }
    });
  };

  Appointments.remoteMethod("updatePaymentDetails", {
    http: { path: "/update-payment-details", verb: "POST" },
    description: "This API is used to update Payment Details",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "payment_id",
        type: "string",
        required: true,
      },
      {
        arg: "accessToken",
        type: "string",
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Appointments.updatePaymentDetails = function (
    id,
    payment_id,
    accessToken,
    callback
  ) {
    if (!id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (!payment_id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    Appointments.findOne({where:{id}}, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response) {
        var result = response;
        result.payment_id = payment_id;
        result.payment_status = "PAID"
        response.updateAttributes(result, (response) => {
          mresponseSuccess.message = msuccess.payment;
          mresponseSuccess.data = result;
          callback(null, mresponseSuccess);
        });
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
        return;
      }
    });
  };
};
