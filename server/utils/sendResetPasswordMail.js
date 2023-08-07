const { sendMail } = require("./sendMail");
require("dotenv").config();
module.exports.sendResetPasswordMail = async (email, token, is_vendor) => {
  const href = is_vendor
    ? `${process.env.FRNTURL}/auth/admin/resetpassword?t=${token}&email=${email}&iv=${is_vendor}`
    : `${process.env.FRNTURL}/auth/resetpassword?t=${token}&email=${email}&iv=${is_vendor}`;
  const subject = "Reset your Password at NILE";
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h2> Hi ${email}, </h2> 
  <p style="margin-bottom: 30px;">Click on the link to reset your password! The link is valid for 5 minutes only! </p>

  <a href=${href} style="background-color: #86c61f; border: none;
  color: #000000;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;" > Reset Password </a> 

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
