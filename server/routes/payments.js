const bodyParser = require("body-parser");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { sendNewOrderMailVendor } = require("../utils/sendNewOrderMailVendor");
const { sendNewOrderMailUser } = require("../utils/sendNewOrderMailUser");

router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));

const payu = require("payu-sdk-node-index-fixed")({
  key: process.env.MERCHKEY,
  salt: process.env.MERCHSALT, // should be on server side only
});

router.post("/initpayment", async (req, res) => {
  const {
    user_id,
    products,
    transactionID,
    orderID,
    fullname,
    email,
    phone,
    amount,
    address_id,
  } = req.body;

  try {
    await products.map(async (product) => {
      await pool.query(
        "INSERT into orders(user_id, amount,transaction_id,product_id, quantity,order_id,vendor_id,payment_status,address_id, product_info,firstname,email) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id",
        [
          user_id,
          product.amount,
          transactionID,
          product.productID,
          product.quantity,
          orderID,
          product.vendor_id,
          "In Progress",
          address_id,
          `OrderId${orderID}`,
          fullname,
          email,
        ]
      );
    });

    var data = {
      key: process.env.MERCHKEY,
      txnid: transactionID,
      amount,
      productinfo: `OrderId${orderID}`,
      firstname: fullname,
      email,
      phone,
      surl: "https://dae0-27-63-28-193.ngrok-free.app/payments/successpay",
      furl: "https://dae0-27-63-28-193.ngrok-free.app/payments/failedpay",
    };
    const url = process.env.TESTPAYMENTURL;

    const hash = payu.hasher.generateHash({
      txnid: data.txnid,
      amount: data.amount,
      productinfo: data.productinfo,
      firstname: data.firstname,
      email: data.email,
    });
    data.hash = hash;
    await pool.query("UPDATE orders SET hash=$1 WHERE order_id=$2", [
      hash,
      orderID,
    ]);
    res.send({ url, data });
  } catch (orderError) {
    console.log(orderError);
    res.send({});
  }
});
const sendNewOrderEmailtoVendor = async (order_id) => {
  try {
    const distinctVendors = await pool.query(
      "SELECT DISTINCT vendor_id from orders where order_id=$1",
      [order_id]
    );
    const vendors = await Promise.all(
      distinctVendors.rows.map(async (vendor) => {
        const vendorDetails = await pool.query(
          "SELECT business_name, email from vendors where id=$1",
          [vendor.vendor_id]
        );
        return vendorDetails.rows[0];
      })
    );
    vendors.map((vendor) => {
      sendNewOrderMailVendor(vendor.business_name, vendor.email, order_id);
    });
  } catch (error) {
    console.error("Vendor Email Sending Error", error);
  }
};
const sendNewOrderEmailtoUser = async (user_id, order_id) => {
  try {
    const user = await pool.query("SELECT name, email from users where id=$1", [
      user_id,
    ]);
    const product_ids = await pool.query(
      "SELECT product_id from orders where order_id=$1",
      [order_id]
    );
    const products = await Promise.all(
      product_ids.rows.map(async (item) => {
        const product = await pool.query(
          "SELECT name, image FROM products where id=$1",
          [item.product_id]
        );
        return product.rows[0];
      })
    );
    sendNewOrderMailUser(
      user.rows[0].name,
      user.rows[0].email,
      order_id,
      products
    );
  } catch (error) {
    console.log("userEmailOrderSend Error ", error);
  }
};

router.post("/successpay", async (req, res) => {
  //dont uncomment the comments or delete
  const { mihpayid, mode, status, productinfo, amount, txnid, hash } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT transaction_id, amount, product_info, firstname,email FROM orders WHERE transaction_id=$1",
      [txnid]
    );
    const strAmount = rows[0].amount.toFixed(2);
    // const isValidHash = payu.hasher.validateHash(hash, {
    //   txnid: rows[0].transaction_id,
    //   amount: String(strAmount),
    //   productinfo: rows[0].product_info,
    //   firstname: rows[0].firstname,
    //   email: rows[0].email,
    //   status: status,
    // });
    const order_id = productinfo.slice(7);

    // if (true) {
    const payinfo = await pool.query(
      "INSERT into payments(order_id, amount, status, transaction_id, product_info, mihpayid,mode) VALUES($1,$2,$3,$4,$5,$6,$7) returning id",
      [
        order_id,
        Number(amount).toFixed(2),
        status,
        txnid,
        productinfo,
        mihpayid,
        mode,
      ]
    );
    // console.log("payinfo");
    await pool.query(
      "UPDATE orders set payment_status=$1, payment_details_id=$2 where order_id=$3 returning *",
      [status, payinfo.rows[0].id, order_id]
    );
    // console.log("updatee payments");
    sendNewOrderEmailtoVendor(order_id);
    // console.log("vendoremailsent");
    const user = await pool.query(
      "SELECT user_id from orders where order_id=$1",
      [order_id]
    );
    // console.log("user");
    sendNewOrderEmailtoUser(user.rows[0].user_id, order_id);
    // console.log("userEmailsent");
    await pool.query("DELETE from cart where user_id=$1", [
      user.rows[0].user_id,
    ]);
    // console.log("cart empty");
    // } else {
    //   await pool.query(
    //     "UPDATE orders set payment_status=$1 where order_id=$3",
    //     ["SuccessfulTamperedPayment", order_id]
    //   );
    //   res.redirect(
    //     `http://localhost:3000/checkout/?paymentdone=true&status=fail&t=${txnid}`
    //   );
    // }
    res.redirect(
      `http://localhost:3000/checkout/?paymentdone=true&status=success&t=${txnid}`
    );
  } catch (paymenterror) {
    console.error("Payment Error : ", paymenterror);
    res.redirect(
      `http://localhost:3000/checkout/?paymentdone=true&status=fail&t=${txnid}`
    );
  }
});
router.post("/failedpay", async (req, res) => {
  const { mihpayid, mode, status, productinfo, amount, txnid, hash } = req.body;
  const order_id = productinfo.slice(7);
  try {
    const { rows } = await pool.query(
      "SELECT transaction_id, amount, product_info, firstname,email FROM orders WHERE transaction_id=$1",
      [txnid]
    );
    const isValidHash = payu.hasher.validateHash(hash, {
      txnid: rows[0].transaction_id,
      amount: Number(rows[0].amount).toFixed(2),
      productinfo: rows[0].product_info,
      firstname: rows[0].firstname,
      email: rows[0].email,
      status: status,
    });
    if (isValidHash) {
      const payinfo = await pool.query(
        "INSERT into payments(order_id, amount, status, transaction_id, product_info, mihpayid,mode) VALUES($1,$2,$3,$4,$5,$6,$7) returning id",
        [order_id, amount, status, txnid, productinfo, mihpayid, mode]
      );
      await pool.query(
        "UPDATE orders set payment_status=$1, payment_details_id=$2, order_status='Failed' where order_id=$3",
        [status, payinfo.rows[0].id, order_id]
      );
    } else {
      await pool.query(
        "UPDATE orders set payment_status=$1 where order_id=$3",
        ["FailedTamperedPayment", order_id]
      );
    }
  } catch (error) {
    console.log("Failed PAY Error", error);
  }

  res.redirect(
    `http://localhost:3000/checkout/?paymentdone=true&status=fail&t=${txnid}`
  );
});
router.post("/getpaydetails", async (req, res) => {
  const { user_id, txnid } = req.body;
  try {
    const payid = await pool.query(
      `SELECT payment_details_id from orders where user_id=${user_id} AND transaction_id='${txnid}'`
    );
    if (payid.rows.length) {
      const data = await pool.query(
        `SELECT transaction_id,order_id,mihpayid FROM payments WHERE id=${payid.rows[0].payment_details_id}`
      );
      res.send(data.rows[0]);
    } else {
      res.send({});
    }
  } catch (error) {
    console.error(error);
    res.send({});
  }
});

router.post("/vendorpaymentstats", async (req, res) => {
  const { vendor_id } = req.body;

  const sumOfSales = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) from orders WHERE vendor_id=$1 AND payment_status='success'",
    [vendor_id]
  );
  const sumOfCheckedOutAmount = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) from vendorappliedcheckouts WHERE vendor_id=$1 AND status='approved'",
    [vendor_id]
  );
  const sumOfCheckedOutPendingAmount = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) from vendorappliedcheckouts WHERE vendor_id=$1 AND status='pending'",
    [vendor_id]
  );
  const currentBalance =
    sumOfSales.rows[0].coalesce -
    sumOfCheckedOutAmount.rows[0].coalesce -
    sumOfCheckedOutPendingAmount.rows[0].coalesce;
  res.send({
    totalSales: sumOfSales.rows[0].coalesce,
    checkedOut: sumOfCheckedOutAmount.rows[0].coalesce,
    currentBalance,
  });
});

router.post("/initiatevendorpayment", async (req, res) => {
  const { checkoutAmount, vendor_id, upiAddress } = req.body;

  try {
    const sumOfSales = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) from orders WHERE vendor_id=$1 AND payment_status='success'",
      [vendor_id]
    );
    // console.log(sumOfSales.rows[0].coalesce);
    const sumOfCheckedOutAmount = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) from vendorappliedcheckouts WHERE vendor_id=$1 AND status='approved'",
      [vendor_id]
    );
    // console.log(sumOfCheckedOutAmount.rows[0].coalesce);
    const sumOfCheckedOutPendingAmount = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) from vendorappliedcheckouts WHERE vendor_id=$1 AND status!='denied'",
      [vendor_id]
    );
    // console.log(sumOfCheckedOutPendingAmount.rows[0].coalesce);
    const currentBalance =
      sumOfSales.rows[0].coalesce - sumOfCheckedOutAmount.rows[0].coalesce;

    if (
      checkoutAmount >= currentBalance ||
      checkoutAmount === 0 ||
      upiAddress.length < 3
    ) {
      res.send({ status: 403 });
    } else {
      const applyCheckout = await pool.query(
        "INSERT into vendorappliedcheckouts(vendor_id, amount, upi_address) VALUES($1,$2,$3)",
        [vendor_id, checkoutAmount, upiAddress]
      );
      res.send({ status: 200 });
    }
  } catch (err) {
    console.log("initiate Vendor Payment Error", err);
    res.send({ status: 500 });
  }
});
router.post("/previoustransactions", async (req, res) => {
  const { vendor_id } = req.body;
  try {
    const transactions = await pool.query(
      "SELECT * from vendorappliedcheckouts where vendor_id=$1 ORDER BY created_at DESC",
      [vendor_id]
    );
    res.send(transactions.rows);
  } catch (err) {
    console.log("previous Transactions Error", err);
    res.send([]);
  }
});
router.get("/admintransactions", async (req, res) => {
  try {
    const transactions = await pool.query(
      "select vav.id, vendor_id, amount, created_at, modified_at, status, denyreason,business_name,phone, email, upi_address,transaction_id  from vendorappliedcheckouts vav join vendors v on vav.vendor_id=v.id ORDER BY created_at DESC"
    );
    res.send(transactions.rows);
  } catch (err) {
    console.log("Admin Transactions Error", err);
    res.send([]);
  }
});
router.post("/approvecheckout", async (req, res) => {
  const { transactionID, vendor_id, checkoutID } = req.body;
  try {
    await pool.query(
      "UPDATE vendorappliedcheckouts SET transaction_id=$1, status='approved' WHERE vendor_id=$2 AND id=$3",
      [transactionID, vendor_id, checkoutID]
    );
    res.send({ status: 200 });
  } catch (err) {
    console.log("approveCheckout Error", err);
    res.send({ status: 500 });
  }
});
router.post("/denycheckout", async (req, res) => {
  const { newDenialReason, vendor_id, checkoutID } = req.body;
  try {
    await pool.query(
      "UPDATE vendorappliedcheckouts SET denyreason=$1, status='denied' WHERE vendor_id=$2 AND id=$3",
      [newDenialReason, vendor_id, checkoutID]
    );
    res.send({ status: 200 });
  } catch (err) {
    console.log("approveCheckout Error", err);
    res.send({ status: 500 });
  }
});
module.exports = router;
