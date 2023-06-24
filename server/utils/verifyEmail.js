const { sendMail } = require("./sendMail");

module.exports.verifyEmail = async ({ token, email }) => {
  const subject = "Verify your Email Address with AlSaleels";
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h2>Welcome to AlSaleels.</h2>
  <p style="margin-bottom: 30px;">Please verify your email by clicking the following link: </p>

  <a href="http://localhost:3000/auth/verifyEmail/?verify=${token}&email=${email}" style="background-color: #f59d3f; border: none;
  color: #000000;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;" > Verify Email </a> 
  <p style="margin-top: 30px;">The link Expires in 5 Minutes </p>

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
