const { sendMail } = require("./sendMail");

module.exports.sendApprovalMail = async (name, email) => {
  const subject = "Your Registration has been Approved with AlSaleels!";
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h1> Hi ${name}, </h1> 
  <h2>Welcome to AlSaleels.</h2>
  <p style="margin-bottom: 30px;">Congratulations! Your Registration has been Approved! You can now access your Admin Panel by Loggin in as Vendor in the Vendor Login Page.  </p>

  <a href="http://localhost:3000/adminlogin" style="background-color: #f59d3f; border: none;
  color: #000000;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;" > Login </a> 
  <p style="margin-top: 30px;">We hope you will enjoy eCommerce with us.  </p>

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
