require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
  sendOrderStatusUpdateUser,
} = require("../utils/sendOrderStatusUpdateUser");
router.post("/allorders", async (req, res) => {
  const { vendor_id, is_super_admin } = req.body;
  var products = [];
  var orders = [];
  try {
    if (!is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders where vendor_id=$1 ORDER BY created_at DESC",
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
    } else if (is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders ORDER BY created_at DESC"
      );
      // console.log(orderIds);
      var productIds = [];
      for (let orderId of orderIds.rows) {
        const { order_id } = orderId;
        try {
          var order = await pool.query(
            `select * from orders where order_id='${order_id}'`
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
    }
  } catch (allOrdersError) {
    console.error("allOrdersError : ", allOrdersError);
    res.send([]);
  }
});
router.post("/pending", async (req, res) => {
  const { vendor_id, is_super_admin } = req.body;
  var products = [];
  var orders = [];
  try {
    if (!is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders where vendor_id=$1 AND payment_status='success' AND order_status!='delivered' ORDER BY created_at DESC",
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
    } else if (is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders where payment_status='success' AND order_status!='delivered' ORDER BY created_at DESC"
      );
      // console.log(orderIds);
      var productIds = [];
      for (let orderId of orderIds.rows) {
        const { order_id } = orderId;
        try {
          var order = await pool.query(
            `select * from orders where order_id='${order_id}' `
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
    }
  } catch (allOrdersError) {
    console.error("Pending Orders Error : ", allOrdersError);
    res.send([]);
  }
});
router.post("/completed", async (req, res) => {
  const { vendor_id, is_super_admin } = req.body;
  var products = [];
  var orders = [];
  try {
    if (!is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders where vendor_id=$1 AND payment_status='success' AND order_status='delivered' ORDER BY created_at DESC",
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
    } else if (is_super_admin) {
      const orderIds = await pool.query(
        "SELECT DISTINCT order_id,created_at FROM orders where payment_status='success' AND order_status='delivered' ORDER BY created_at DESC"
      );
      // console.log(orderIds);
      var productIds = [];
      for (let orderId of orderIds.rows) {
        const { order_id } = orderId;
        try {
          var order = await pool.query(
            `select * from orders where order_id='${order_id}' AND order_status='delivered'`
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
    }
  } catch (allOrdersError) {
    console.error("Completed Orders Error : ", allOrdersError);
    res.send([]);
  }
});
router.post("/getOrderProductDetails", async (req, res) => {
  const { address_id, payment_details_id, user_id, product_id, order_id } =
    req.body;
  try {
    const address = await pool.query(
      "SELECT full_name, phone_number, country,phone_number, pincode,house_no_company,area_street_village,landmark, town_city, state,created_at FROM shippingaddress where id=$1 ORDER BY created_at",
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
    var product = await pool.query(
      "SELECT id,name,category, image, brand_id, vendor_id FROM products WHERE id=$1",
      [product_id]
    );

    const deliveryDetails = await pool.query(
      "SELECT order_status from orders where product_id=$1 AND order_id=$2",
      [product_id, order_id]
    );
    const vendorName = await pool.query(
      "SELECT business_name,email from vendors where id=$1",
      [product.rows[0].vendor_id]
    );

    const brand = await pool.query("SELECT brand FROM brands where id=$1", [
      product.rows[0].brand_id,
    ]);

    res.send({
      address: address.rows[0],
      payment: payment.rows[0],
      user: user.rows[0],
      product: {
        ...product.rows[0],
        ...brand.rows[0],
        order_status: deliveryDetails.rows[0]?.order_status,
        seller: {
          name: vendorName.rows[0].business_name,
          email: vendorName.rows[0].email,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.send({});
  }
});
const sendOrderStatusMailUser = async (order_id, vendor_id) => {
  try {
    const order = await pool.query(
      "SELECT user_id,order_status from orders where order_id=$1 AND vendor_id=$2",
      [order_id, vendor_id]
    );
    const user = await pool.query("SELECT name,email from users where id=$1", [
      order.rows[0].user_id,
    ]);
    const vendor = await pool.query(
      "SELECT business_name from vendors where id=$1",
      [vendor_id]
    );
    sendOrderStatusUpdateUser(
      user.rows[0].name,
      user.rows[0].email,
      order_id,
      order.rows[0].order_status,
      vendor.rows[0].business_name
    );
  } catch (error) {
    console.log("Order Status Update Error", error);
  }
};
router.post("/changeorderstatus", async (req, res) => {
  const { vendor_id, newStatus, order_id } = req.body;
  // console.log(req.body);
  try {
    await pool.query(
      "UPDATE orders SET order_status=$1 WHERE order_id=$2 AND vendor_id=$3",
      [newStatus, order_id, vendor_id]
    );
    sendOrderStatusMailUser(order_id, vendor_id);
    res.send(true);
  } catch (err) {
    console.log(err);
    res.send(false);
  }
});
module.exports = router;
