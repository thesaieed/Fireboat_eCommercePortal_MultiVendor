const express = require("express");
const pool = require("./db"); //database include
const cors = require("cors"); //used for handing trasmission json data from server to client
const multer = require("multer");
const fs = require("fs");

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
      if (password === foundUser.rows[0].password) {
        //checking if body password === db.password

        const { id, name, isadmin } = foundUser.rows[0];
        data = { loginStatus: 200, user: { id, name, isadmin } };
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

//Signup up route handling
app.post("/signup", async (req, res) => {
  // console.log("req.body : ", req.body);
  const { fullname, email, password, phone } = req.body;
  try {
    const newUser = await pool.query(
      // `insert into users(name,email,password,phone) values ('${fullname}','${email}','${password}','${phone}') returning *`
      "INSERT INTO users(name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING *",
[fullname, email, password, phone]

    );
    // console.log("newUSer", newUser);

    const { id, name } = newUser.rows[0];
    const data = { user: { id, name } };
    res.send(data); //send data.. it will be under res.data in client
  } catch (error) {
    console.error(error);
    if (error.code == 23505) {  //error code trying to insert duplicate value
      console.log("User already exists");
      res
        .status(409)
        .json({ message: "user already exists, please use SignIn" });
    } else {
      res.status(409).json({ message: "Something went wrong at Server !" });
    }
  }
});

app.post("/addcategory", async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await pool.query(
      "insert into categories(name) values ($1) returning *",
      [name]
    );
    res.send(newCategory.rows[0]);
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

//Modified addProduct handle to handle image upload also

app.post("/admin/addproduct", upload.single("image"), async (req, res) => {
  const { category, name, description, price, stock_available } = req.body;
  // console.log(req.body)
  // console.log(req.file)
  const imagePath = req.file.path;

  try {
    const newProduct = await pool.query(
      "insert into products(category_id,name,description,price,stock_available,image) values ($1,$2,$3,$4,$5,$6) returning *",
      [category, name, description, price, stock_available, imagePath]
    );
    // console.log("newProduct", newProduct);
    const data = { product: newProduct.rows[0] };

    res.send(data);
  } catch (error) {
    console.error(error);
  }
});

//get all products route
app.get("/allproducts", async (req, res) => {
  try {
    const products = await pool.query(`select * from products`);
    res.send(products.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/checkusersloggedintokens", async (req, res) => {
  const { userToken } = req.body;
  // console.log("token :", userToken);
  try {
    const user = await pool.query(
      `select * from users where '${userToken}' = ANY (logged_in_tokens)`
    );
    // console.log(user);
    if (user.rows.length) {
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
  const { id, token } = req.body;
  // console.log("token :", token);
  try {
    const oldTokens = await pool.query(
      `SELECT logged_in_tokens from users WHERE id=${id}`
    );
    var newTokens = oldTokens.rows[0].logged_in_tokens;
    // console.log("new Tokens", newTokens);
    if (!newTokens) {
      newTokens = [token];
    } else {
      newTokens.push(token);
    }
    await pool.query(
      `UPDATE users SET logged_in_tokens = '{${newTokens}}'
      WHERE id = ${id} returning *`
    );
    res.send(true);
  } catch (error) {
    // console.error(error);
    res.send(false);
  }
});
app.post("/removeusersloggedintokens", async (req, res) => {
  const { id, userToken } = req.body;
  // console.log("token :", token);
  try {
    await pool.query(
      `update users set logged_in_tokens = array_remove(logged_in_tokens, '${userToken}') WHERE id=${id};`
    );
    res.send(true);
  } catch (error) {
    // console.error(error);
    res.send(false);
  }
});
app.post("/userdetails", async (req, res) => {
  const { userToken } = req.body;
  try {
    const user = await pool.query(
      `select * from users where '${userToken}' = ANY (logged_in_tokens)`
    );

    const { id, name, email, isadmin, address, phone } = user.rows[0];
    res.send({ id, name, email, isadmin, address, phone });
  } catch (err) {
    res.send({});
  }
});

//route to handle get product details for a specific product
app.get("/admin/productdetails", async (req, res) => {
  const productId = req.query.id;
  // console.log(productId)
  try {
    const productDetails = await pool.query(
      "select * from products where id =$1",
      [productId]
    );
    if (productDetails.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(productDetails.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("internal Server error");
  }
});

//searchProducts
app.post("/search", async (req, res) => {
  const { searchTerms } = req.body;
  let queryTerm = "";
  //send all Products if searchTerm = allProducts.. else search the database
  if ("allProducts".includes(searchTerms)) {
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

//handle get request from Cart
app.get("/cart", async (req, res) => {
  const user_id = req.query.id;
  // console.log(user_id)
  try {
    const cartDetails1 = await pool.query(
      // "SELECT DISTINCT ON (product_id) id, product_id, quantity FROM cart WHERE user_id = $1 ORDER BY product_id, created_at DESC",
      // [user_id] //basically checks db and returns dintinct product_ids(i.e different prods in cart of user) or user with corresponding details
   
      "select id, product_id, quantity from cart where user_id=$1",[user_id] //simplified logic with updation
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
        text: "SELECT name, price, image, category FROM products WHERE  id= ANY($1::int[])",
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
app.get("/viewproducts", async (req, res) => {
  try {
    const getProducts = await pool.query("select * from products");
    // console.log(getProducts.rows);
    res.send(getProducts.rows);
  } catch (error) {
    console.error(error);
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

//Route to delete image of product from server
app.delete("/deleteImage/:imagePath", (req, res) => {
  const imagePath = req.params.imagePath;
  fs.unlink(`${imagePath}`, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
      res.status(500).json({ error: "Failed to delete image" });
    } else {
      res.sendStatus(200);
    }
  });
});

app.put(
  "/admin/updateproduct/:productId",
  upload.single("image"),
  async (req, res) => {
    const { productId } = req.params;
    const { category, name, description, price, stock_available } = req.body;
    const imagePath = req.file ? req.file.path : null; // Check if image file is present
    // console.log(productId, category, price, stock_available, name, description);
    // console.log(req.body)

    try {
      let query;
      let queryValues;
      if (imagePath) {
        // Update the image field along with other details
        query =
          "UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, stock_available = $5, image = $6 WHERE id = $7";
        queryValues = [
          category,
          name,
          description,
          price,
          stock_available,
          imagePath,
          productId,
        ];
      } else {
        // Keep the existing image value in the database
        query =
          "UPDATE products SET category_id = $1, name = $2, description = $3, price = $4, stock_available = $5 WHERE id = $6";
        queryValues = [
          category,
          name,
          description,
          price,
          stock_available,
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

//listen
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
