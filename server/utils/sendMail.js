require("dotenv").config();
const MAIL_SETTINGS = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async ({ email, subject, body }) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: email,
      subject: subject,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
