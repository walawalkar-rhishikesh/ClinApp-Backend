/* eslint-disable */
let { verifyToken } = require("../util/jwt-functions");
let { mstatus, merror } = require("../config/http-messages");
var mresponseError = {
  status: mstatus.forbidden,
  message: merror.forbidden,
};
module.exports = function () {
  return function accessVerify(req, res, next) {
    next()
    return
    if (req && req.url && req.url.includes("/api/")) {
      var excludeUrl = false;
      var accessToken;
      if (req.url.includes("/api/users/signin")) {
        excludeUrl = true;
      }
      if (req.url.includes("/api/users/get-active-users")) {
        excludeUrl = true;
      }
      if (req.url.includes("/api/users/signin")) {
        excludeUrl = true;
      }
      if (req.url.includes("/api/users/signup")) {
        excludeUrl = true;
      }
      if (excludeUrl) {
        next();
      } else {
        if (req.params && req.params.accessToken)
          accessToken = req.params.accessToken;
        if (req.query && req.query.accessToken)
          accessToken = req.query.accessToken;
        if (accessToken && verifyToken(accessToken)) {
          next();
        } else {
          res.send(mresponseError) ;
        }
      }
    }else{
      next();
    }
    // Track every API
    //   console.log('Request tracking middleware triggered on %s', req.url);
    //   var start = process.hrtime();
    //   res.once('finish', function() {
    //     var diff = process.hrtime(start);
    //     var ms = diff[0] * 1e3 + diff[1] * 1e-6;
    //     console.log('The request processing time is %d ms.', ms);
    //   });
  };
};
