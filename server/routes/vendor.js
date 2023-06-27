const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const pool = require("../db");
const { sendApprovalMail } = require("../utils/sendApprovalMail");
const { sendRejectionMail } = require("../utils/sendRejectionMail");
const generateTokenAndSendMail = require("../utils/generateTokenandSendMail");

router.post("/allvendors", async (req, res) => {
  // console.log("allvendors route");
  const { is_super_admin } = req.body;
  if (is_super_admin) {
    const allVendors = await pool.query(
      "SELECT id, is_admin, is_super_admin, business_name, business_address, disapproved_reason, email, is_approved, is_under_approval, isemailverified, phone FROM vendors where is_super_admin=false"
    );

    res.send(allVendors.rows);
  } else {
    res.send([]);
  }
});
router.post("/getapprovevendorslist", async (req, res) => {
  // console.log("allvendors route");

  const { is_super_admin } = req.body;
  if (is_super_admin) {
    const allData = await pool.query("SELECT * FROM newvendorsapproval");
    const vendorIds = allData.rows.map((item) => item.vendor_id); //get array of productIds
    // console.log(vendorIds);

    const query = {
      text: "SELECT id, is_admin, is_super_admin, business_name, business_address, disapproved_reason, email, is_approved, is_under_approval, isemailverified, phone FROM vendors WHERE id= ANY($1::int[])",
      values: [vendorIds],
    };
    const allVendorsList = await pool.query(query);
    // console.log(allVendorsList);
    res.send(allVendorsList.rows);
  } else {
    res.send([]);
  }
});
router.post("/approvevendor", async (req, res) => {
  // console.log(req.body);
  const vendorId = req.body.itemId;
  try {
    const updatedVendor = await pool.query(
      `UPDATE vendors set is_approved=true, is_under_approval=false WHERE id=${vendorId} returning *`
    );
    // console.log(updatedVendor);
    if (updatedVendor.rows[0].is_approved) {
      try {
        await pool.query(
          `DELETE from newvendorsapproval WHERE vendor_id=${vendorId} `
        );
        await sendApprovalMail(
          updatedVendor.rows[0].business_name,
          updatedVendor.rows[0].email
        );
        res.send({ status: 200 });
      } catch (error) {
        console.error(error);
      }
    } else {
      res.send({});
    }
  } catch (error) {
    res.send({});
    console.error(error);
  }
});
router.post("/rejectvendor", async (req, res) => {
  // console.log(req.body);
  const vendorId = req.body.itemId;
  const rejectionReason = req.body.rejectionReason;
  try {
    const updatedVendor = await pool.query(
      `UPDATE vendors set is_approved=false, is_under_approval=false WHERE id=${vendorId} returning *`
    );
    // console.log(updatedVendor);
    if (!updatedVendor.rows[0].is_approved) {
      try {
        await pool.query(
          `DELETE from newvendorsapproval WHERE vendor_id=${vendorId} `
        );
        await sendRejectionMail(
          updatedVendor.rows[0].business_name,
          updatedVendor.rows[0].email,
          rejectionReason
        );
        res.send({ status: 200 });
      } catch (error) {
        console.error(error);
      }
    } else {
      res.send({});
    }
  } catch (error) {
    res.send({});
    console.error(error);
  }
});

router.post("/newvendor", async (req, res) => {
  var { businessname, email, password, business_name, phone } = req.body;
  password = await bcrypt.hash(password, 12);
  try {
    const newVendor = await pool.query(
      // `insert into users(name,email,password,phone) values ('${fullname}','${email}','${password}','${phone}') returning *`
      "INSERT INTO vendors(business_name, email, password,phone, is_under_approval) VALUES ($1, $2, $3, $4,$5) RETURNING *",
      [businessname, email, password, phone, true]
    );
    // console.log(newVendor);
    const emailResponse = await generateTokenAndSendMail(
      newVendor.rows[0].id,
      email,
      true
    );

    res.send(emailResponse);
  } catch (err) {
    console.error(err);
    if (err.code == 23505) {
      //error code trying to insert duplicate value
      // console.log("User already exists");
      res
        .status(409)
        .json({ message: "Vendor email already exists, please use SignIn" });
    } else {
      res.status(409).json({ message: "Something went wrong at Server !" });
    }
  }
});

router.post("/login", async (req, res) => {
  // console.log("vendor Login");
  try {
    // console.log(req.body);
    const { email, password } = req.body; //geting data from body
    let data = {}; // defing data obj to be sent back based on diffent conditions below

    const foundUser = await pool.query(
      `select * from vendors where email='${email}'`
    ); //checking if the email exists in db
    // console.log(foundUser);
    if (foundUser.rows.length > 0) {
      // if email exists, a row array is sent back in foundUser obj
      const passwordMatched = await bcrypt.compare(
        password,
        foundUser.rows[0].password
      ); //checking if body password === db.password
      // console.log("result login hashCheck : ", passwordMatched);
      if (passwordMatched) {
        const {
          id,
          business_name,
          is_admin,
          isemailverified,
          is_super_admin,
          is_approved,
          is_under_approval,
        } = foundUser.rows[0];
        if (!isemailverified) {
          await generateTokenAndSendMail(id, email);
          data = { loginStatus: 407 }; //not email verified
        } else if (is_under_approval) {
          data = { loginStatus: 102 }; //approval under process
        } else if (is_approved === false) {
          data = { loginStatus: 406 }; //not approved
        } else {
          data = {
            loginStatus: 200,
            user: {
              id,
              name: business_name,
              is_admin: is_admin,
              is_super_admin,
            },
          };
        }
      } else {
        // console.log("Invalid Credentials");
        data = { loginStatus: 401 }; //if user exists but password doesnt matchm set only the variable too 401 (forbidden)
      }
    } else {
      data = { loginStatus: 404 }; //if no user found, that means user entered wrong info
    }

    res.send(data); //finaly send the data variable(obj)
  } catch (error) {
    console.log("Error : ", error.message);
  }
});

router.delete("/editvendor/:itemId", async (req, res) => {
  const vendorId = req.params.itemId;
  try {
    await pool.query("DELETE FROM vendors WHERE id = $1", [vendorId]);
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting Vendor:", error);
    res.status(500).json({ error: "Failed to delete Vendor" });
  }
});
module.exports = router;
