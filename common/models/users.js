/* eslint-disable */
"use strict";

let {
  generateHashPassword,
  matchUserPassword,
} = require("../../server/util/bcrypt-functions");
let {
  mstatus,
  msuccess,
  merror,
} = require("../../server/config/http-messages");
let { userTypes, nodeMailerConst } = require("../../server/config/constants");
let { generateJWT } = require("../../server/util/jwt-functions");

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
let { sendEmailViaNodeMailer } = require("../../server/util/node-mailer");

module.exports = function (Users) {
  Users.remoteMethod("getActiveUsers", {
    http: { path: "/get-active-users", verb: "get" },
    description: "Get all the users with isDeleted : false and isActive : true",
    // accepts: {
    //   arg: 'id',
    //   type: 'number',
    //   required: true,
    //   http: {source: 'query'},
    // },
    returns: { arg: "body", type: "object", root: true },
  });
  Users.getActiveUsers = function (callback) {
    Users.find(
      { where: { isDeleted: false, isActive: true } },
      (err, response) => {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else {
          mresponseSuccess.data = response;
          callback(null, mresponseSuccess);
        }
      }
    );
  };

  Users.remoteMethod("signup", {
    http: { path: "/signup", verb: "post" },
    description: "This API is used for user signup",
    accepts: [
      {
        arg: "fname",
        type: "string",
        required: true,
      },
      {
        arg: "lname",
        type: "string",
      },
      {
        arg: "email",
        type: "string",
        required: true,
      },
      {
        arg: "password",
        type: "string",
        required: false,
      },
      {
        arg: "utype",
        type: "string",
        required: true,
        description: "Values: ['PATIENT','DOCTOR','STAFF']",
        default: userTypes.patient,
      },
      {
        arg: "createdby",
        type: "string",
        required: true,
        default: "self",
      },
      {
        arg: "isInvite",
        type: "boolean",
        required: true,
        default: false,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.signup = function (
    fname,
    lname,
    email,
    password,
    utype,
    createdby,
    isInvite,
    callback
  ) {
    email = email.toLowerCase();
    if (!fname) {
      mresponseError.message = merror.userFName;
      callback(null, mresponseError);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      mresponseError.message = merror.emailFormat;
      callback(null, mresponseError);
      return;
    }
    if (isInvite) {
      password = "clinApp@91674144";
    }
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      mresponseError.message = merror.passwordPattern;
      callback(null, mresponseError);
      return;
    }
    if (
      userTypes.patient === utype ||
      userTypes.doctor === utype ||
      userTypes.staff === utype
    ) {
    } else {
      mresponseError.message = merror.userType;
      callback(null, mresponseError);
      return
    }
    generateHashPassword(password.trim()).then((hash) => {
      var userData = {
        fname: fname.trim(),
        lname: lname ? lname.trim() : "",
        email: email.toLowerCase().trim(),
        password: hash,
        utype,
        createdby: createdby ? createdby.trim() : "SELF",
        updatedon: new Date(),
        createdon: new Date(),
      };
      Users.find({ where: { email } }, (err, response) => {
        if (err) {
          mresponseError.message = err;
          callback(null, mresponseError);
        } else if (response && response.length > 0) {
          mresponseError.message = merror.useraleadyExists;
          callback(null, mresponseError);
        } else {
          Users.create(userData, (err, response) => {
            if (err) {
              mresponseError.message = err;
              callback(null, mresponseError);
            } else if (response) {
              if (isInvite) {
                var mailAttachment = nodeMailerConst.userCreationViaInvite(
                  fname
                );
                sendEmailViaNodeMailer(
                  email,
                  mailAttachment.subject,
                  mailAttachment.text
                );
              }
              response.password = "";
              // response.id = '';
              mresponseSuccess.message = msuccess.register;
              response["accessToken"] = generateJWT({ id: response.id });
              mresponseSuccess.data = response;
              callback(null, mresponseSuccess);
            } else {
              mresponseError.message = merror.no_records;
              callback(null, mresponseError);
            }
          });
        }
      });
    });
  };
  Users.remoteMethod("signin", {
    http: { path: "/signin", verb: "get" },
    description: "This API is used for user signin",
    accepts: [
      {
        arg: "email",
        type: "string",
        required: true,
      },
      {
        arg: "password",
        type: "string",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.signin = function (email, password, callback) {
    email = email.toLowerCase();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      mresponseError.message = merror.emailFormat;
      callback(null, mresponseError);
      return;
    }
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      mresponseError.message = merror.passwordPattern;
      callback(null, mresponseError);
      return;
    }
    Users.findOne({ where: { email } }, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.password) {
        matchUserPassword(password, response.password).then((result) => {
          if (result) {
            mresponseSuccess.message = msuccess.login;
            response["accessToken"] = generateJWT({ id: response.id });
            response.password = "";
            // response.id = '';
            mresponseSuccess.data = response;
            callback(null, mresponseSuccess);
          } else {
            mresponseError.message = merror.login;
            callback(null, mresponseError);
          }
        });
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
      }
    });
  };

  Users.remoteMethod("signupWithGoogle", {
    http: { path: "/signupWithGoogle", verb: "post" },
    description: "This API is used for user signup",
    accepts: [
      {
        arg: "fname",
        type: "string",
        required: true,
      },
      {
        arg: "lname",
        type: "string",
      },
      {
        arg: "email",
        type: "string",
        required: true,
      },
      {
        arg: "utype",
        type: "string",
        required: true,
        description: "Values: ['PATIENT','DOCTOR','STAFF']",
        default: userTypes.patient,
      },
      {
        arg: "createdby",
        type: "string",
        required: true,
        default: "self",
      },
      {
        arg: "googleId",
        type: "string",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.signupWithGoogle = function (
    fname,
    lname,
    email,
    utype,
    createdby,
    googleId,
    callback
  ) {
    email = email.toLowerCase();
    if (!fname) {
      mresponseError.message = merror.userFName;
      callback(null, mresponseError);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      mresponseError.message = merror.emailFormat;
      callback(null, mresponseError);
      return;
    }
    if (
      userTypes.patient === utype ||
      userTypes.doctor === utype ||
      userTypes.staff === utype
    ) {
    } else {
      mresponseError.message = merror.userType;
      callback(null, mresponseError);
      return
    }
    if (!googleId) {
      mresponseError.message = merror.googleID;
      callback(null, mresponseError);
      return;
    }
    var userData = {
      fname: fname.trim(),
      lname: lname ? lname.trim() : "",
      email: email.toLowerCase().trim(),
      utype,
      createdby: createdby ? createdby.trim() : "SELF",
      updatedon: new Date(),
      createdon: new Date(),
      googleId: googleId.trim(),
    };
    Users.find({ where: { email } }, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.length > 0) {
        mresponseError.message = merror.useraleadyExists;
        callback(null, mresponseError);
      } else {
        Users.create(userData, (err, response) => {
          if (err) {
            mresponseError.message = err;
            callback(null, mresponseError);
          } else if (response) {
            response.password = "";
            // response.id = '';
            mresponseSuccess.message = msuccess.register;
            response["accessToken"] = generateJWT({ id: response.id });
            mresponseSuccess.data = response;
            callback(null, mresponseSuccess);
          } else {
            mresponseError.message = merror.no_records;
            callback(null, mresponseError);
          }
        });
      }
    });
  };

  Users.remoteMethod("signinWithGoogle", {
    http: { path: "/signinWithGoogle", verb: "get" },
    description: "This API is used for user signin",
    accepts: [
      {
        arg: "email",
        type: "string",
        required: true,
      }
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.signinWithGoogle = function (email, callback) {
    email = email.toLowerCase();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      mresponseError.message = merror.emailFormat;
      callback(null, mresponseError);
      return;
    }
    Users.findOne({ where: { email } }, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.email) {
        mresponseSuccess.message = msuccess.login;
        response["accessToken"] = generateJWT({ id: response.id });
        response.password = "";
        // response.id = '';
        mresponseSuccess.data = response;
        callback(null, mresponseSuccess);
      } else {
        mresponseError.message = merror.login;
        callback(null, mresponseError);
      }
    });
  };
  Users.remoteMethod("sendAppointmentCreationNotification", {
    http: { path: "/sendAppointmentCreationNotification", verb: "post" },
    description: "This API is used for sendAppointmentCreationNotification",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "time",
        type: "string",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.sendAppointmentCreationNotification = function (id, time, callback) {
    Users.findOne({ where: { id } }, (err, response) => {
      if (err) {
        // mresponseError.message = err;
        // callback(null, mresponseError);
      } else if (response && response.email) {
        var mailAttachment = nodeMailerConst.appointmentCreation(
          response.fname,
          time
        );
        sendEmailViaNodeMailer(
          response.email,
          mailAttachment.subject,
          mailAttachment.text
        );
        // mresponseSuccess.message = msuccess.success;
        // mresponseSuccess.data = response;
        // callback(null, mresponseSuccess);
      } else {
        // mresponseError.message = merror.request;
        // callback(null, mresponseError);
      }
    });
  };
  Users.remoteMethod("sendAppointmentPaymentNotification", {
    http: { path: "/sendAppointmentPaymentNotification", verb: "post" },
    description: "This API is used for sendAppointmentCreationNotification",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "time",
        type: "string",
        required: true,
      },
      {
        arg: "cost",
        type: "number",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.sendAppointmentPaymentNotification = function (
    id,
    time,
    cost,
    callback
  ) {
    Users.findOne({ where: { id } }, (err, response) => {
      if (err) {
        // mresponseError.message = err;
        // callback(null, mresponseError);
      } else if (response && response.email) {
        var mailAttachment = nodeMailerConst.paymentReminder(
          response.fname,
          time,
          cost
        );
        sendEmailViaNodeMailer(
          response.email,
          mailAttachment.subject,
          mailAttachment.text
        );
        // mresponseSuccess.message = msuccess.success;
        // mresponseSuccess.data = response;
        // callback(null, mresponseSuccess);
      } else {
        // mresponseError.message = merror.request;
        // callback(null, mresponseError);
      }
    });
  };
  Users.remoteMethod("userPasswordUpdate", {
    http: { path: "/user-password-update", verb: "post" },
    description: "This API is used for updating user password",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "password",
        type: "string",
        required: true,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.userPasswordUpdate = function (id, password, callback) {
    if (!id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      mresponseError.message = merror.passwordPattern;
      callback(null, mresponseError);
      return;
    }
    Users.findOne({ where: { id } }, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.email) {
        generateHashPassword(password.trim()).then((hash) => {
          var result = response;
          result.password = hash;
          result.updatedon = new Date();
          response.updateAttributes(result, (response) => {
            result["accessToken"] = generateJWT({ id: result.id });
            var mailAttachment = nodeMailerConst.passwordChange(result.fname);
            sendEmailViaNodeMailer(
              result.email,
              mailAttachment.subject,
              mailAttachment.text
            );
            mresponseSuccess.message = msuccess.updatePassword;
            mresponseSuccess.data = result;
            callback(null, mresponseSuccess);
          });
        });
      } else {
        mresponseError.message = merror.no_records;
        callback(null, mresponseError);
      }
    });
  };

  Users.remoteMethod("updateUserProfile", {
    http: { path: "/update-user-profile", verb: "post" },
    description: "This API is used for update-user-profile",
    accepts: [
      {
        arg: "id",
        type: "string",
        required: true,
      },
      {
        arg: "fname",
        type: "string",
        required: true,
      },
      {
        arg: "lname",
        type: "string",
      },
      {
        arg: "contact",
        type: "string",
        required: false,
        trim: true,
      },
      {
        arg: "address",
        type: "string",
        required: false,
        trim: true,
      },
      {
        arg: "zipcode",
        type: "number",
        required: false,
      },
      {
        arg: "state",
        type: "string",
        required: false,
      },
      {
        arg: "country",
        type: "string",
        required: false,
      },
    ],
    returns: { arg: "body", type: "object", root: true },
  });
  Users.updateUserProfile = function (
    id,
    fname,
    lname,
    contact,
    address,
    zipcode,
    state,
    country,
    callback
  ) {
    if (!id) {
      mresponseError.message = merror.request;
      callback(null, mresponseError);
      return;
    }
    if (!fname) {
      mresponseError.message = merror.userFName;
      callback(null, mresponseError);
      return;
    }
    Users.findOne({ where: { id } }, (err, response) => {
      if (err) {
        mresponseError.message = err;
        callback(null, mresponseError);
      } else if (response && response.length === 0) {
        mresponseError.message = merror.useraleadyExists;
        callback(null, mresponseError);
      } else {
        var result = response;
        result.fname = fname;
        result.lname = lname;
        result.contact = contact;
        result.address = address;
        result.zipcode = zipcode;
        result.state = state;
        result.country = country;
        result.updatedon = new Date();
        response.updateAttributes(result, (response) => {
          result["accessToken"] = generateJWT({ id: result.id });
          mresponseSuccess.message = msuccess.update;
          mresponseSuccess.data = result;
          callback(null, mresponseSuccess);
        });
      }
    });
  };
};
