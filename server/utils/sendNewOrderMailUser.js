const { sendMail } = require("./sendMail");

module.exports.sendNewOrderMailUser = async (
  name,
  email,
  order_id,
  products
) => {
  const orderdetails = products.map((product) => `${product.name}`);
  const subject = `Your Order "${order_id}" has been Places at NILE`;
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h1> Hi ${name}, </h1> 
  <h2>Your Order on NILE has been successfully Placed</h2>
  <p style="margin-bottom: 10px;"> Order ID : ${order_id}</p>
  <p style="margin-top: 30px;">Order Details</p> 
  <ol>
  ${orderdetails.map((item) => `<li>${item}</li>`)}
  </ol>

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
