const { sendMail } = require("./sendMail");

module.exports.sendRejectionMail = async (name, email, rejectionReason) => {
  const subject = "Your Registration has been Rejected with NILE!";
  const body = `<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h1> Hi ${name}, </h1> 
 
  <p style="margin-bottom: 30px;">We are sorry to inform you that your Registration with NILE has been Rejected.  </p>
  <p> The Reason for Rejection is as follows:  </p>

  <p style="width:80%, margin:auto"> ${
    rejectionReason ? rejectionReason : "No Reason Given!"
  }</p>
  
</div>`;
  const mailResponse = await sendMail({ email, subject, body });
  return mailResponse;
};
