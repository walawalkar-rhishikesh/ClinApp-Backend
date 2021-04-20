/* eslint-disable */
var nodemailer = require('nodemailer');
 
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'myclinapp@gmail.com',
    pass: 'A123456@'
  }
});
 
var mailOptions = {
  from: 'myclinapp@gmail.com',
  to: '',
  subject: '',
  text: ``
};

module.exports = {
    sendEmailViaNodeMailer: (email,subject, text ) =>{
        mailOptions.to = email;
        mailOptions.subject = subject;
        mailOptions.text = text;
        console.log("EMAIL NODE MAILER PAYLOAD: ", JSON.stringify(mailOptions) );
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("Email error: ",error);
            } else {
              console.log('Email success: ' + info.response);
            }
        });
    }
}