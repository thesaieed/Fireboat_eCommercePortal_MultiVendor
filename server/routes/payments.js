// This is your test secret API key.
const sha512 = require("js-sha512");
const bodyParser = require("body-parser");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));

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
        "INSERT into orders(user_id, amount,transaction_id,product_id, quantity,order_id,vendor_id,payment_status,address_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
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
        ]
      );
    });

    const salt = process.env.MERCHSALT;
    var data = {
      key: process.env.MERCHKEY,
      txnid: transactionID,
      amount,
      productinfo: `OrderId${orderID}`,
      firstname: fullname,
      email,
      phone,
      surl: "https://f795-223-189-19-30.ngrok-free.app/payments/successpay",
      furl: "https://f795-223-189-19-30.ngrok-free.app/payments/failedpay",
    };
    const url = process.env.TESTPAYMENTURL;
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;
    const hash = sha512(hashString);
    data.hash = hash;
    res.send({ url, data });
  } catch (orderError) {
    console.log(orderError);
    res.send({});
  }
});
router.post("/successpay", async (req, res) => {
  const { mihpayid, mode, status, productinfo, amount, txnid } = req.body;
  try {
    const order_id = productinfo.slice(7);
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
  } catch (paymenterror) {
    console.error(paymenterror);
  }
  res.redirect(
    `http://localhost:3000/checkout/?paymentdone=true&status=success&t=${txnid}`
  );
});
router.post("/failedpay", async (req, res) => {
  const { mihpayid, mode, status, productinfo, amount, txnid } = req.body;
  const order_id = productinfo.slice(7);
  const payinfo = await pool.query(
    "INSERT into payments(order_id, amount, status, transaction_id, product_info, mihpayid,mode) VALUES($1,$2,$3,$4,$5,$6,$7) returning id",
    [order_id, amount, status, txnid, productinfo, mihpayid, mode]
  );

  await pool.query(
    "UPDATE orders set payment_status=$1, payment_details_id=$2 where order_id=$3",
    [status, payinfo.rows[0].id, order_id]
  );

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
