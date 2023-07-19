require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/allorders", async (req, res) => {
  const { vendor_id } = req.body;
  var products = [];
  var orders = [];
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id FROM orders where vendor_id=$1",
      [vendor_id]
    );
    // console.log(orderIds);
    var productIds = [];
    for (let orderId of orderIds.rows) {
      const { order_id } = orderId;
      try {
        var order = await pool.query(
          `select * from orders where vendor_id='${vendor_id}' AND order_id='${order_id}'`
        );
        order.rows.map((item) => {
          productIds.push(item.product_id);
        });
        orders.push({ [order_id]: order.rows });
      } catch (categoryWiseError) {
        console.error(categoryWiseError);
      }
    }

    for (const id of productIds) {
      try {
        const product = await pool.query(
          "SELECT id, name FROM products WHERE id=$1",
          [id]
        );
        products.push({ ...product.rows[0] });
      } catch (error) {
        console.error("Product IDs Error", error);
      }
    }
    res.send({ orders, products });
  } catch (allOrdersError) {
    console.error("allOrdersError : ", allOrdersError);
    res.send([]);
  }
});
router.post("/pending", async (req, res) => {
  const { vendor_id } = req.body;
  var products = [];
  var orders = [];
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id FROM orders where vendor_id=$1 AND payment_status='success' AND order_status!='delivered'",
      [vendor_id]
    );
    // console.log(orderIds);
    var productIds = [];
    for (let orderId of orderIds.rows) {
      const { order_id } = orderId;
      try {
        var order = await pool.query(
          `select * from orders where vendor_id='${vendor_id}' AND order_id='${order_id}' `
        );
        order.rows.map((item) => {
          productIds.push(item.product_id);
        });
        orders.push({ [order_id]: order.rows });
      } catch (categoryWiseError) {
        console.error(categoryWiseError);
      }
    }

    for (const id of productIds) {
      try {
        const product = await pool.query(
          "SELECT id, name FROM products WHERE id=$1",
          [id]
        );
        products.push({ ...product.rows[0] });
      } catch (error) {
        console.error("Product IDs Error", error);
      }
    }
    res.send({ orders, products });
  } catch (allOrdersError) {
    console.error("allOrdersError : ", allOrdersError);
    res.send([]);
  }
});
router.post("/completed", async (req, res) => {
  const { vendor_id } = req.body;
  var products = [];
  var orders = [];
  try {
    const orderIds = await pool.query(
      "SELECT DISTINCT order_id FROM orders where vendor_id=$1 AND payment_status='success' AND order_status='delivered'",
      [vendor_id]
    );
    // console.log(orderIds);
    var productIds = [];
    for (let orderId of orderIds.rows) {
      const { order_id } = orderId;
      try {
        var order = await pool.query(
          `select * from orders where vendor_id='${vendor_id}' AND order_id='${order_id}' `
        );
        order.rows.map((item) => {
          productIds.push(item.product_id);
        });
        orders.push({ [order_id]: order.rows });
      } catch (categoryWiseError) {
        console.error(categoryWiseError);
      }
    }

    for (const id of productIds) {
      try {
        const product = await pool.query(
          "SELECT id, name FROM products WHERE id=$1",
          [id]
        );
        products.push({ ...product.rows[0] });
      } catch (error) {
        console.error("Product IDs Error", error);
      }
    }
    res.send({ orders, products });
  } catch (allOrdersError) {
    console.error("allOrdersError : ", allOrdersError);
    res.send([]);
  }
});
router.post("/getOrderProductDetails", async (req, res) => {
  const { address_id, payment_details_id, user_id, product_id } = req.body;
  try {
    const address = await pool.query(
      "SELECT country,phone_number, pincode,house_no_company,area_street_village,landmark, town_city, state FROM shippingaddress where id=$1",
      [address_id]
    );
    const payment = await pool.query(
      "SELECT amount,transaction_id,status, mihpayid,mode FROM payments where id=$1",
      [payment_details_id]
    );
    const user = await pool.query(
      "SELECT name, email, phone from users where id=$1",
      [user_id]
    );
    const product = await pool.query(
      "SELECT id,name,category, image, brand_id FROM products WHERE id=$1",
      [product_id]
    );

    const brand = await pool.query("SELECT brand FROM brands where id=$1", [
      product.rows[0].brand_id,
    ]);

    res.send({
      address: address.rows[0],
      payment: payment.rows[0],
      user: user.rows[0],
      product: { ...product.rows[0], ...brand.rows[0] },
    });
  } catch (err) {
    console.error(err);
    res.send({});
  }
});
router.post("/changeorderstatus", async (req, res) => {
  const { vendor_id, newStatus, order_id } = req.body;
  // console.log(req.body);
  try {
    await pool.query(
      "UPDATE orders SET order_status=$1 WHERE order_id=$2 AND vendor_id=$3",
      [newStatus, order_id, vendor_id]
    );
    res.send(true);
  } catch (err) {
    console.log(err);
    res.send(false);
  }
});
module.exports = router;
