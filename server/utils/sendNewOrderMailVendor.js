const { sendMail } = require("./sendMail");
require("dotenv").config();
module.exports.sendNewOrderMailVendor = async (
  business_name,
  email,
  order_id
) => {
  const subject = "New Order on NILE";
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h1> Hi ${business_name}, </h1> 
  <h2>You have a New Order</h2>
  <p style="margin-bottom: 10px;"> Order ID : ${order_id}</p>
  <p style="margin-top: 30px;">Login in to NILE to see Complete Order Details  </p> 
  <a href="${FRNTURL}/auth/admin/login" style="background-color: #86c61f; border: none;
  color: #000000;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;" > Click here for Details </a> 

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
