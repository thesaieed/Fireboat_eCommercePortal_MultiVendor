require("dotenv").config();
const express = require("express");
const pool = require("./db"); //database include
const cors = require("cors"); //used for handing trasmission json data from server to client
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const { verifyEmail } = require("./utils/verifyEmail");
var jwt = require("jsonwebtoken");
const generateTokenAndSendMail = require("./utils/generateTokenandSendMail");
const vendorRoutes = require("./routes/vendor");
const reviewRoutes = require("./routes/review");
const paymentRoutes = require("./routes/payments");
const app = express(); // running app
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//Alternate storage object with simple file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.use("/vendor", vendorRoutes);
app.use("/review", reviewRoutes);
app.use("/payments", paymentRoutes);
//login route
app.post("/login", async (req, res) => {
  // console.log("body: ", req.body);
  try {
    // console.log(req.body);
    const { email, password } = req.body; //geting data from body
    let data = {}; // defing data obj to be sent back based on diffent conditions below

    const foundUser = await pool.query(
      `select * from users where email='${email}'`
    ); //checking if the email exists in db

    if (foundUser.rows.length > 0) {
      // if email exists, a row array is sent back in foundUser obj
      let passwordMatched = false;
      if (foundUser.rows[0].password != null) {
        passwordMatched = await bcrypt.compare(
          password,
          foundUser.rows[0].password
        ); //checking if body password === db.password}
      }
      // console.log("result login hashCheck : ", passwordMatched);
      if (passwordMatched) {
        const { id, name, isadmin, isemailverified, isactive } =
          foundUser.rows[0];
        if (!isemailverified) {
          await generateTokenAndSendMail(id, email);
          data = { loginStatus: 407 };
        } else {
          data = { loginStatus: 200, user: { id, name, isadmin, isactive } };
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
app.post("/googlelogin", async (req, res) => {
  // console.log("body: ", req.body);
  try {
    // console.log(req.body);
    const { email, googlename, email_verified } = req.body; //geting data from body
    let data = {}; // defing data obj to be sent back based on diffent conditions below

    const foundUser = await pool.query(
      `select * from users where email='${email}'`
    ); //checking if the email exists in db

    if (foundUser.rows.length > 0) {
      // if email exists, a row array is sent back in foundUser obj

      // console.log("result login hashCheck : ", passwordMatched);
      const { id, name, isadmin, isemailverified, isactive } =
        foundUser.rows[0];
      if (!isemailverified) {
        await generateTokenAndSendMail(id, email);
        data = { loginStatus: 407 };
      } else {
        data = { loginStatus: 200, user: { id, name, isadmin, isactive } };
      }
    } else {
      const newUser = await pool.query(
        // `insert into users(name,email,password,phone) values ('${fullname}','${email}','${password}','${phone}') returning *`
        "INSERT INTO users(name, email, isemailverified) VALUES ($1, $2, $3) RETURNING *",
        [googlename, email, email_verified]
      );
      const { id, name, isadmin } = newUser.rows[0];
      // console.log("Invalid Credentials");
      data = { loginStatus: 200, user: { id, name, isadmin } }; //if user exists but password doesnt matchm set only the variable too 401 (forbidden)
    }

    res.send(data); //finaly send the data variable(obj)
  } catch (error) {
    console.log("Error : ", error.message);
  }
});

app.post("/verifyEmail", async (req, res) => {
  const { token, email, isVendor } = req.body;
  // console.log(req.body);
  try {
    var user;
    if (isVendor === "false") {
      // console.log("user verify");
      user = await pool.query(`select * from users  WHERE email='${email}';`);
    } else if (isVendor === "true") {
      // console.log("Vendor verify");
      user = await pool.query(`select * from vendors  WHERE email='${email}';`);
    }

    if (!user.rows[0]?.id) {
      res.send({
        status: 404,
        message: "User Not Found ! ",
      });
    } else {
      jwt.verify(token, process.env.TOKENPVTKEY, async function (err, decoded) {
        // console.log("error : ", err);
        // console.log("decoded : ", decoded);
        if (err) {
          // console.log(err);
          res.send({
            status: 400,
            message: "Token invalid or Expired ! ",
          });
        } else if (decoded) {
          // console.log(decoded);
          const userid = decoded?.data;
          try {
            // console.log(user);
            if (isVendor === "false") {
              await pool.query(
                `update users set isemailverified = true WHERE id=${userid};`
              );
              res.send({
                status: 200,
                message: "Email Verified Successfully! ",
              });
            } else if (isVendor === "true") {
              await pool.query(
                `update vendors set isemailverified = true, is_under_approval=true WHERE id=${userid};`
              );
              let newVendorError = false;
              try {
                await pool.query(
                  `INSERT INTO newvendorsapproval(vendor_id) VALUES (${userid})`
                );
              } catch (newVendorErr) {
                newVendorError = true;
                console.error(newVendorErr);
                if (newVendorErr.code == 23505) {
                  res.send({
                    status: 102,
                    message:
                      "Email Verified Already! Approval Pending! Please Check your email for the same. ",
                  });
                }
              }
              if (!newVendorError) {
                res.send({
                  status: 102,
                  message:
                    "Email Verified Successfully! Please wait for an Approval from us. An Email will be sent on Registered Email for the same. ",
                });
              }
            }
          } catch (error) {
            console.error(error);
            res.send({
              status: 400,
              message: "Failed to Verify Email! ",
            });
          }
        }
      });
    }
  } catch (err) {
    console.log();
    res.send({
      status: 500,
      message: "Server Error! ",
    });
  }
  // console.log("token : ", token);
});

app.post("/resendEmailverification", async (req, res) => {
  const { email, isVendor } = req.body;
  // console.log(email);
  try {
    var resp;
    if (isVendor === "false") {
      resp = await pool.query(`select * from users where email='${email}'`);
    } else if (isVendor === "true") {
      resp = await pool.query(`select * from vendors  WHERE email='${email}';`);
    }

    // console.log(resp);
    if (resp.rows[0].isemailverified) {
      res.send({ status: 202, message: "Email already Verified!" });
    } else {
      if (isVendor === "false") {
        const response = await generateTokenAndSendMail(resp.rows[0].id, email);
        res.send(response);
      } else if (isVendor === "true") {
        const response = await generateTokenAndSendMail(
          resp.rows[0].id,
          email,
          true
        );
        res.send(response);
      }
      // console.log(response);
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: 404,
      message: "Failed to send Verification Email! ",
    });
  }
});

//Signup up route handling
app.post("/signup", async (req, res) => {
  // console.log("req.body : ", req.body);
  var { fullname, email, password } = req.body;
  password = await bcrypt.hash(password, saltRounds);
  // console.log("hashed Password :", password);
  try {
    const newUser = await pool.query(
      // `insert into users(name,email,password,phone) values ('${fullname}','${email}','${password}','${phone}') returning *`
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [fullname, email, password]
    );
    // console.log("newUSer", newUser);

    //generate a token including userID as data for verification
    const token = jwt.sign(
      {
        data: newUser.rows[0].id,
      },
      process.env.TOKENPVTKEY,
      { expiresIn: 5 * 60 }
    );
    try {
      //send a verification email with token
      const emailResponce = await verifyEmail({
        token: token,
        email: email,
      });
      // console.log("emailResponce : ", emailResponce);
      if (!emailResponce) {
        res.send({
          status: 404,
          message: "Failed to send Verification Email! ",
        });
      } else {
        res.send({
          status: 200,
          message: "Verification Email sent on the registered Email. ",
        });
      }
    } catch (err) {
      // res.send(respond);
      console.log(err);
      res.send({
        status: 404,
        message: "Failed to send Verification Email! ",
      });
    }
    //   const { id, name } = newUser.rows[0];
    //   const data = { user: { id, name } };
    //   res.send(data); //send data.. it will be under res.data in client
  } catch (error) {
    console.error(error);
    if (error.code == 23505) {
      //error code trying to insert duplicate value
      // console.log("User already exists");
      res
        .status(409)
        .json({ message: "user already exists, please use SignIn" });
    } else {
      res.status(409).json({ message: "Something went wrong at Server !" });
    }
  }
});

app.post("/addcategory", async (req, res) => {
  const { name, vendorId } = req.body;

  try {
    const newCategory = await pool.query(
      "insert into categories(name, vendor_id) values ($1,$2) returning *",
      [name, vendorId]
    );
    res.send(newCategory.rows[0]);
  } catch (err) {
    console.log(err);
    if (err.code == 23505) {
      res.status(409).send();
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});
// add new brand
app.post("/addbrand", async (req, res) => {
  const { brand, vendorId } = req.body;

  try {
    const newBrand = await pool.query(
      "insert into brands(brand,vendor_id) values ($1,$2) returning *",
      [brand, vendorId]
    );
    res.send(newBrand.rows[0]);
  } catch (err) {
    if (err.code == 23505) {
      res.status(409).send();
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

//handle the get request for categories from client

app.get("/admin/categories", async (req, res) => {
  // console.log(req.body);
  try {
    const categories = await pool.query("select * from categories");

    const data = { categories: categories.rows };
    // console.log(data)
    res.send(data);
  } catch (error) {
    console.error(error);
    res.send([]);
  }
});

//getallbrands
app.get("/brands", async (req, res) => {
  try {
    const brand = await pool.query(`select * from brands`);
    // console.log(brand);
    res.send(brand.rows);
  } catch (error) {
    console.error(error);
    res.send({});
  }
});

//Modified addProduct handle to handle image upload also

// app.post("/admin/addproduct", upload.array("image", 5), async (req, res) => {
//   const {
//     category,
//     name,
//     description,
//     price,
//     stock_available,
//     brand,
//     vendor_id,
//   } = req.body;
//   // console.log(req.body)
//   // console.log(req.files);
//   // console.log("description: ", description);
//   const imagePath = req.files[0].path;

//   try {
//     const newProduct = await pool.query(
//       "insert into products(category_id,name,description,price,stock_available,image,brand_id,vendor_id ) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *",
//       [
//         category,
//         name,
//         description,
//         price,
//         stock_available,
//         imagePath,
//         brand,
//         vendor_id,
//       ]
//     );
//     // console.log("newProduct", newProduct);
//     const data = { product: newProduct.rows[0] };

//     res.send(data);
//   } catch (error) {
//     console.error(error);
//   }
// });
app.post("/admin/addproduct", upload.array("image", 5), async (req, res) => {
  const {
    category,
    name,
    description,
    price,
    stock_available,
    brand,
    vendor_id,
  } = req.body;

  try {
    const imagePaths = req.files.map((file) => file.path); // Get an array of image paths

    const newProduct = await pool.query(
      "INSERT INTO products(category_id, name, description, price, stock_available, image, brand_id, vendor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        category,
        name,
        description,
        price,
        stock_available,
        imagePaths,
        brand,
        vendor_id,
      ]
    );

    const data = { product: newProduct.rows[0] };

    res.send(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send status code 500 for internal server error
  }
});

app.post("/checkusersloggedintokens", async (req, res) => {
  var { userToken, isvendor } = req.body;

  // console.log("isVendorType before :", typeof isvendor);
  typeof isvendor == "string"
    ? (isvendor = JSON.parse(isvendor.toLowerCase()))
    : (isvendor = isvendor);
  // console.log("isVendorType after :", typeof isvendor);
  try {
    // console.log("isVendor : ", isvendor);
    var user;
    if (!isvendor) {
      user = await pool.query(
        `select * from users where '${userToken}' = ANY (logged_in_tokens)`
      );
    } else if (isvendor) {
      user = await pool.query(
        `select * from vendors where '${userToken}' = ANY (logged_in_tokens)`
      );
    }
    // console.log(user);
    if (user.rows.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.send(false);
  }
});

app.post("/addusersloggedintokens", async (req, res) => {
  const { id, token, isvendor } = req.body;
  // console.log("token :", token);
  try {
    var oldTokens;
    if (!isvendor) {
      oldTokens = await pool.query(
        `SELECT logged_in_tokens from users WHERE id=${id}`
      );
    } else if (isvendor) {
      oldTokens = await pool.query(
        `SELECT logged_in_tokens from vendors WHERE id=${id}`
      );
    }

    var newTokens = oldTokens.rows[0].logged_in_tokens;
    // console.log("new Tokens", newTokens);
    if (!newTokens) {
      newTokens = [token];
    } else {
      newTokens.push(token);
    }

    if (!isvendor) {
      await pool.query(
        `UPDATE users SET logged_in_tokens = '{${newTokens}}'
      WHERE id = ${id} returning *`
      );
    } else if (isvendor) {
      await pool.query(
        `UPDATE vendors SET logged_in_tokens = '{${newTokens}}'
      WHERE id = ${id} returning *`
      );
    }
    res.send(true);
  } catch (error) {
    // console.error(error);
    res.send(false);
  }
});
app.post("/removeusersloggedintokens", async (req, res) => {
  const { id, userToken, isvendor } = req.body;
  // console.log("token :", token);
  try {
    if (!isvendor) {
      await pool.query(
        `update users set logged_in_tokens = array_remove(logged_in_tokens, '${userToken}') WHERE id=${id};`
      );
    } else if (isvendor) {
      await pool.query(
        `update vendors set logged_in_tokens = array_remove(logged_in_tokens, '${userToken}') WHERE id=${id};`
      );
    }
    res.send(true);
  } catch (error) {
    // console.error(error);
    res.send(false);
  }
});
app.post("/userdetails", async (req, res) => {
  var { userToken, isvendor } = req.body;
  typeof isvendor == "string"
    ? (isvendor = JSON.parse(isvendor.toLowerCase()))
    : (isvendor = isvendor);
  var user;
  try {
    if (!isvendor) {
      user = await pool.query(
        `select * from users where '${userToken}' = ANY (logged_in_tokens)`
      );
      const { id, name, email, address, phone } = user.rows[0];
      res.send({ id, name, email, is_admin: false, address, phone });
    } else if (isvendor) {
      user = await pool.query(
        `select * from vendors where '${userToken}' = ANY (logged_in_tokens)`
      );
      const {
        id,
        business_name,
        email,
        is_admin,
        is_super_admin,
        business_address,
        phone,
      } = user.rows[0];
      res.send({
        id,
        name: business_name,
        email,
        is_admin,
        is_super_admin,
        address: business_address,
        phone,
      });
    }
  } catch (err) {
    res.send({});
  }
});

//route to handle get product details for a specific product
app.get("/admin/productdetails", async (req, res) => {
  const { productId, userId } = req.query;
  // console.log(productId)
  try {
    let productDetails = await pool.query(
      "select * from products where id =$1",
      [productId]
    );
    if (productDetails.rows.length === 0) {
      res.sendStatus(404);
    } else {
      const brandDetails = await pool.query(
        "select * from brands where id =$1",
        [productDetails.rows[0].brand_id]
      );
      const vendorDetails = await pool.query(
        "select business_name from vendors where id =$1",
        [productDetails.rows[0].vendor_id]
      );

      productDetails.rows[0].brand = brandDetails.rows[0].brand;
      productDetails.rows[0].vendor = vendorDetails.rows[0].business_name;
      // console.log("prod : ", productDetails.rows[0]);
      var userReviewforProduct;
      const usersreview = await pool.query(
        "select rating,review from reviews where user_id=$1 AND product_id=$2",
        [userId, productId]
      );
      if (usersreview.rowCount > 0) {
        userReviewforProduct = usersreview.rows[0];
      } else {
        userReviewforProduct = [];
      }
      productDetails.rows[0].userReviewforProduct = userReviewforProduct;
      res.send(productDetails.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("internal Server error");
  }
});

//searchProducts
app.post("/search", async (req, res) => {
  // console.log(req.body);
  const { searchTerms, category } = req.body;
  let queryTerm = "";

  //send all Products if searchTerm = allProducts.. else search the database
  if ("categoryProducts".includes(searchTerms)) {
    try {
      const searchResult = await pool.query(
        `SELECT * FROM products where category='${category}'`
      );
      res.send(searchResult.rows);
    } catch (err) {
      console.error(err);
      res.send([]);
    }
  } else if ("allProducts".includes(searchTerms)) {
    try {
      const searchResult = await pool.query(`SELECT * FROM products`);
      res.send(searchResult.rows);
    } catch (err) {
      console.error(err);
      res.send([]);
    }
  } else {
    if (searchTerms?.length) {
      searchTerms.map((term, index) => {
        if (index === searchTerms.length - 1) {
          queryTerm += `${term}`;
        } else {
          queryTerm += `${term}&`;
        }
      });
    }

    try {
      const searchResult = await pool.query(
        `SELECT * FROM products WHERE to_tsvector(name) @@ to_tsquery( '${queryTerm}')`
      );
      res.send(searchResult.rows);
    } catch (err) {
      console.error(err);
      res.send([]);
    }
  }
});

// //handle Addtocart post request
// app.post("/addtocart",async(req,res) =>{
//   try {
//     const {user_id,product_id,quantity} = req.body
//     const data = await pool.query("insert into cart(user_id,product_id,quantity) values($1,$2,$3) returning *",[user_id,product_id,quantity])
//   //  console.log(req.body)
//   // console.log("cart:",data.rows[0])
//   res.send(data)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send("internal server error")
//   }
// })

// Handle Addtocart post request
app.post("/addtocart", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Check if the same user and product combination already exists in the cart
    const existingCartItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existingCartItem.rows.length > 0) {
      // If the item exists, update the quantity
      const updatedCartItem = await pool.query(
        "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *",
        [quantity, user_id, product_id]
      );

      res.send(updatedCartItem.rows[0]);
    } else {
      // If the item doesn't exist, create a new entry
      const newCartItem = await pool.query(
        "INSERT INTO cart(user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [user_id, product_id, quantity]
      );

      res.send(newCartItem.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.post("/numberofcartproducts", async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
  try {
    const productIds = await pool.query(
      // "SELECT DISTINCT ON (product_id) id, product_id, quantity FROM cart WHERE user_id = $1 ORDER BY product_id, created_at DESC",
      // [user_id] //basically checks db and returns dintinct product_ids(i.e different prods in cart of user) or user with corresponding details

      "select product_id from cart where user_id=$1",
      [userId] //simplified logic with updation
    );
    // console.log(productIds);
    // console.log(productIds.rows.length);
    res.send({ itemCount: productIds.rows.length });
  } catch (err) {
    console.log(err);
    res.send({ itemCount: 0 });
  }
});

//handle get request from Cart
app.get("/cart", async (req, res) => {
  const user_id = req.query.id;

  // console.log(user_id)
  try {
    const cartDetails1 = await pool.query(
      // "SELECT DISTINCT ON (product_id) id, product_id, quantity FROM cart WHERE user_id = $1 ORDER BY product_id, created_at DESC",
      // [user_id] //basically checks db and returns dintinct product_ids(i.e different prods in cart of user) or user with corresponding details

      "select id, product_id, quantity from cart where user_id=$1",
      [user_id] //simplified logic with updation
    );
    // console.log(cartDetails1.rows);
    if (cartDetails1.rows.length === 0) {
      res.send("Could not fetch the cart details");
    } else {
      data1 = cartDetails1.rows;
      // console.log(data1)
      const productIds = data1.map((item) => item.product_id); //get array of productIds
      // console.log(productIds)
      const query = {
        text: "SELECT id, name, price, image, category,brand_id, vendor_id FROM products WHERE  id= ANY($1::int[])",
        values: [productIds],
      };
      const cartDetails2 = await pool.query(query);

      if (cartDetails2.rows.length === 0) {
        res.send("Could not fetch the product details");
      } else {
        data2 = cartDetails2.rows;
        // console.log(cartDetails2.rows)
      }

      //optional to be added if needed
      const cartDetails3 = await pool.query("Select * from users where id=$1", [
        user_id,
      ]);

      if (cartDetails3.rows.length === 0) {
        res.send("Could not fetch the user details");
      } else {
        data3 = cartDetails3.rows;
        // console.log(data3)
      }

      //Now Sending the required data Modify according to need
      const combinedData = {
        data1,
        data2,
        data3,
      };
      // console.log(combinedData)
      res.json(combinedData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("internal Server error");
  }
});

// Handle PUT request to update cart item quantity
app.put("/cart/:id", async (req, res) => {
  const itemId = req.params.id;
  const { quantity } = req.body;
  // console.log(itemId,quantity)
  try {
    // Update the quantity of the cart item in the database
    const updateQuery = "UPDATE cart SET quantity = $1 WHERE id = $2";
    await pool.query(updateQuery, [quantity, itemId]);

    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Handle delete request from cart
app.delete("/cart/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  // console.log(itemId)
  try {
    // Perform the database operation to delete the item from the cart
    await pool.query("DELETE FROM cart WHERE id = $1", [itemId]);

    // Send a success response
    res.send("Item deleted from cart successfully");
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Handle get Request from AllProducts
app.post("/viewproducts", async (req, res) => {
  const { is_super_admin, vendorId } = req.body;
  if (is_super_admin) {
    try {
      const getProducts = await pool.query(
        "select * from products order by modified_at DESC"
      );
      // console.log(getProducts.rows);
      res.send(getProducts.rows);
    } catch (error) {
      console.error(error);
    }
  } else if (!is_super_admin) {
    try {
      const getProducts = await pool.query(
        "select * from products where vendor_id=$1 order by modified_at DESC",
        [vendorId]
      );
      // console.log(getProducts.rows);
      res.send(getProducts.rows);
    } catch (error) {
      console.error(error);
    }
  }
});

//get all products route
app.get("/viewproducts", async (req, res) => {
  try {
    const products = await pool.query(`select * from products`);
    res.send(products.rows);
  } catch (err) {
    console.error(err);
  }
});

//Handle delete request from ViewAllProducts
app.delete("/viewproducts/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [itemId]);
    res
      .status(200)
      .json({ message: "Item deleted from products successfully" });
  } catch (error) {
    console.error("Error deleting item from products:", error);
    res.status(500).json({ error: "Failed to delete item from products" });
  }
});

app.delete("/deleteImage/:imagePaths", (req, res) => {
  const imagePaths = req.params.imagePaths.split(","); // Split the image paths into an array

  imagePaths.forEach((imagePath) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      }
    });
  });

  res.sendStatus(200);
});

app.put(
  "/admin/updateproduct/:productId",
  upload.array("image", 5),
  async (req, res) => {
    const { productId } = req.params;
    const { category, name, description, price, stock_available, brand_id } =
      req.body;
    const imagePaths = req.files.map((file) => file.path); // Get an array of image paths

    try {
      let query;
      let queryValues;

      if (imagePaths.length > 0) {
        // Update the image field along with other details
        query =
          "UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, stock_available = $5, image = $6, brand_id =$7 WHERE id = $8";
        queryValues = [
          category,
          name,
          description,
          price,
          stock_available,
          imagePaths,
          brand_id,
          productId,
        ];
      } else {
        // Keep the existing image value in the database
        query =
          "UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, stock_available = $5, brand_id =$6 WHERE id = $7";
        queryValues = [
          category,
          name,
          description,
          price,
          stock_available,
          brand_id,
          productId,
        ];
      }

      const updatedProduct = await pool.query(query, queryValues);
      res.sendStatus(200); // Send status code 200 to indicate successful update
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Send status code 500 for internal server error
    }
  }
);

//Handle get Request from UpdateCategories
app.get("/updatecategories", async (req, res) => {
  try {
    const getCategories = await pool.query("select * from categories");
    // console.log(getCategories.rows);
    res.send(getCategories.rows);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/updatecategories/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await pool.query("DELETE FROM categories WHERE id = $1", [itemId]);
    res
      .status(200)
      .json({ message: "category type deleted from categories successfully" });
  } catch (error) {
    console.error("Error deleting category type from categories:", error);
    res
      .status(500)
      .json({ error: "Failed to delete category type from categories" });
  }
});

//update category name
app.put("/updatecategories/:id", async (req, res) => {
  const itemId = req.params.id;
  const { categoryType } = req.body;
  try {
    // Update the Category name in categories table
    const updateQuery = "UPDATE categories SET name = $1 WHERE id = $2";
    await pool.query(updateQuery, [categoryType, itemId]);
    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Brands

//edit Brand
app.put("/updatebrands/:id", async (req, res) => {
  const itemId = req.params.id;
  const { brand } = req.body;
  try {
    // Update the Category name in categories table
    const updateQuery = "UPDATE brands SET brand = $1 WHERE id = $2";
    await pool.query(updateQuery, [brand, itemId]);
    res.sendStatus(200); // Send a success response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//delete brand
app.delete("/updatebrands/:itemId", async (req, res) => {
  const itemId = req.params.itemId;
  try {
    await pool.query("DELETE FROM brands WHERE id = $1", [itemId]);
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting Brand", error);
    res.status(500).json({ error: "Failed to delete Brand" });
  }
});

//getvendordata
app.get("/allvendors", async (req, res) => {
  try {
    const allVendors = await pool.query(
      "SELECT id, business_name, business_address, email, phone FROM vendors"
    );
    res.send(allVendors.rows);
  } catch (err) {
    console.error(err);
    res.send([]);
  }
});

//HomePage Routes
app.get("/homedata", async (req, res) => {
  let homeData = [];
  try {
    //get all categories
    var categories = await pool.query("select id,name from categories");
    // categories = categories.rows.map((categoryObject) => {
    //   return categoryObject.name;
    // });
    categories = categories.rows;

    for (category of categories) {
      const categoryName = category.name;
      try {
        var categoryProducts = await pool.query(
          `select * from products where category_id=${category.id}`
        );
        // console.log(categoryProducts);
        // homeData[`${categoryName}`] = categoryProducts.rows;
        homeData.push({ [categoryName]: categoryProducts.rows });
        // console.log("homeData: ", homeData);
      } catch (categoryWiseError) {
        console.error(categoryWiseError);
      }
    }
  } catch (err) {
    console.error(err);
  }
  res.send({ homeData: homeData });
});
//route to handle get request for shipping addresses
app.get("/shippingaddress", async (req, res) => {
  // console.log(req.query.id);
  const user_id = req.query.id;
  try {
    const addresses = await pool.query(
      "select * from shippingaddress where user_id=$1 ",
      [user_id]
    );
    // console.log(addresses.rows);
    res.send(addresses.rows);
  } catch (error) {
    console.log(error);
  }
});
//route to handle post request to add new address to shipping address
app.post("/addshippingaddress", async (req, res) => {
  const data = req.body;
  try {
    await pool.query(
      "INSERT INTO shippingaddress(user_id, full_name,country,phone_number,pincode,house_no_company,area_street_village,landmark,town_city,state) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [
        data.id,
        data.full_name,
        data.country,
        data.phone_number,
        data.pincode,
        data.house_no_company,
        data.area_street_village,
        data.landmark,
        data.town_city,
        data.state,
      ]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

//get request from checkout
app.get("/checkout", async (req, res) => {
  const ids = req.query.ids;
  const intIds = ids.map(Number);
  // console.log(intIds);
  try {
    const query = `
      SELECT id, quantity
      FROM cart
      WHERE id = ANY($1::int[])
    `;
    const values = [intIds];
    const { rows } = await pool.query(query, values);
    // console.log("data", rows);
    res.send(rows);
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/admin/addproductimage/:productId",
  upload.array("image", 5),
  async (req, res) => {
    const { productId } = req.params;
    const imagePaths = req.files.map((file) => file.path); // Get an array of image paths
    // console.log(productId, "imagepath", imagePaths);
    try {
      const existingProduct = await pool.query(
        "SELECT image FROM products WHERE id = $1",
        [productId]
      );
      const currentImagePaths = existingProduct.rows[0].image || []; // Get the current image paths or initialize as an empty array

      const updatedImagePaths = [...currentImagePaths, ...imagePaths]; // Concatenate the current and new image paths

      await pool.query("UPDATE products SET image = $1 WHERE id = $2", [
        updatedImagePaths,
        productId,
      ]);

      res.sendStatus(200); // Send status code 200 for success
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // Send status code 500 for internal server error
    }
  }
);
// app.post("/admin/deleteproductimage", (req, res) => {
//   const data = req.body;
//   console.log(data);
//   res.sendStatus(200);
// });
app.post("/admin/deleteproductimage", async (req, res) => {
  const { selectedRowId, selectedImagePaths } = req.body;

  try {
    // Get the current image paths for the product
    const existingProduct = await pool.query(
      "SELECT image FROM products WHERE id = $1",
      [selectedRowId]
    );
    const currentImagePaths = existingProduct.rows[0].image || [];

    // Remove the selected image paths from the current image paths
    const updatedImagePaths = currentImagePaths.filter(
      (path) => !selectedImagePaths.includes(path)
    );
    const filteredImagePaths = selectedImagePaths.filter(
      (path) => path !== null
    );

    // Format the updated image paths with escaped backslashes
    const formattedImagePaths = updatedImagePaths.map(
      (path) => `"${path.replace(/\\/g, "\\\\")}"`
    );

    // Update the image column with the formatted image paths
    await pool.query("UPDATE products SET image = $1 WHERE id = $2", [
      `{${formattedImagePaths.join(",")}}`, // Enclose the array of paths in curly braces {}
      selectedRowId,
    ]);

    // console.log(selectedImagePaths);
    filteredImagePaths.forEach((imagePath) => {
      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error("Error deleting image:", imagePath, error);
        } // } else {
        //   console.log("Image deleted successfully:", imagePath);
        // }
      });
    });

    // console.log("Image paths deleted successfully");
    res.sendStatus(200); // Send status code 200 for success
  } catch (error) {
    console.error("Error deleting image paths:", error);
    res.sendStatus(500); // Send status code 500 for internal server error
  }
});

app.get("/allusers", async (req, res) => {
  try {
    const allUsers = await pool.query(
      "SELECT id, name, address, email, phone, isActive FROM users"
    );
    res.send(allUsers.rows);
    // res.send("Hello all users");
  } catch (err) {
    console.error(err);
    res.send([]);
  }
});
app.delete("/deleteuser/:userId", async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  try {
    await pool.query("Delete from users where id=$1", [userId]);
    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500, "server error");
  }
});
app.put("/disableuser/:userId", async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  try {
    await pool.query("update  users  set isActive=false where id=$1", [userId]);
    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});
app.put("/enableuser/:userId", async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  try {
    await pool.query("update  users  set isActive=true where id=$1", [userId]);
    // Send a success response
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});
//listen to the radio
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
