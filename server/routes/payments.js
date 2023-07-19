const bodyParser = require("body-parser");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
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
      surl: "https://7354-223-189-4-160.ngrok-free.app/payments/successpay",
      furl: "https://7354-223-189-4-160.ngrok-free.app/payments/failedpay",
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
router.post("/successpay", async (req, res) => {
  const { mihpayid, mode, status, productinfo, amount, txnid, hash } = req.body;
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
    const order_id = productinfo.slice(7);

    if (isValidHash) {
      const payinfo = await pool.query(
        "INSERT into payments(order_id, amount, status, transaction_id, product_info, mihpayid,mode) VALUES($1,$2,$3,$4,$5,$6,$7) returning id",
        [order_id, amount, status, txnid, productinfo, mihpayid, mode]
      );
      await pool.query(
        "UPDATE orders set payment_status=$1, payment_details_id=$2 where order_id=$3",
        [status, payinfo.rows[0].id, order_id]
      );
      const user = await pool.query(
        "SELECT user_id from orders where order_id=$1",
        [order_id]
      );

      await pool.query("DELETE from cart where user_id=$1", [
        user.rows[0].user_id,
      ]);
    } else {
      await pool.query(
        "UPDATE orders set payment_status=$1 where order_id=$3",
        ["SuccessfulTamperedPayment", order_id]
      );
    }
  } catch (paymenterror) {
    console.error(paymenterror);
  }
  res.redirect(
    `http://localhost:3000/checkout/?paymentdone=true&status=success&t=${txnid}`
  );
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
        "UPDATE orders set payment_status=$1, payment_details_id=$2 where order_id=$3",
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

module.exports = router;
