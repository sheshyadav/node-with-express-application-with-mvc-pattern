import "dotenv/config";
import nodemailer from "nodemailer";
import logger from "../app/services/logger.js";

let configOptions = {
  service: process.env.MAIL_MAILER,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(configOptions);

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Nodemailer Server is ready to send messages");
  }
});

async function sendMail(mailOptions){
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.error(error);
    } else {
      logger.info("Email sent: " + info.response);
    }
  });
};

export default sendMail;
