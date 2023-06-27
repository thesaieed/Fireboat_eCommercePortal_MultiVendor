const { verifyEmail } = require("./verifyEmail");
var jwt = require("jsonwebtoken");
const generateTokenAndSendMail = async (userId, email, isVendor) => {
  //generate a token including userID as data for verification
  const token = jwt.sign(
    {
      data: userId,
    },
    process.env.TOKENPVTKEY,
    { expiresIn: 5 * 60 }
  );
  try {
    //send a verification email with token
    const emailResponce = await verifyEmail({
      token: token,
      email: email,
      isVendor: isVendor,
    });
    // console.log("emailResponce : ", emailResponce);
    if (!emailResponce) {
      return {
        status: 404,
        message: "Failed to send Verification Email! ",
      };
    } else {
      return {
        status: 200,
        message: "Verification Email sent on the registered Email. ",
      };
    }
  } catch (err) {
    // res.send(respond);
    return {
      status: 404,
      message: "Failed to send Verification Email! ",
    };
  }
};

module.exports = generateTokenAndSendMail;
