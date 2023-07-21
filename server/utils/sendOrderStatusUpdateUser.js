const { sendMail } = require("./sendMail");

module.exports.sendOrderStatusUpdateUser = async (
  name,
  email,
  order_id,
  status,
  seller
) => {
  const subject = `Status Update on Order "${order_id}"`;
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h1> Hi ${name}, </h1> 
  <h4>Your Order bearing ID '${order_id}' has been ${status} by ${seller}</h4>

</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
