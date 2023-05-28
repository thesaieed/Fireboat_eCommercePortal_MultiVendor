const express = require("express");
const pool = require("./db"); //database include
const cors = require("cors"); //used for handing trasmission json data from server to client
const multer = require("multer");
const path = require("path");
const { log } = require("console");
const { serialize } = require("v8");
const app = express(); // running app
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//configuring disk storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     const fileExtension = file.originalname.split(".").pop();
//     cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
//   },
// });

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
  console.log("req.body : ", req.body);
  const { fullname, email, password, phone } = req.body;
  try {
    const newUser = await pool.query(
      `insert into users(name,email,password,phone) values ('${fullname}','${email}','${password}','${phone}') returning *`
    );
    // console.log("newUSer", newUser);

    const { id, name } = newUser.rows[0];
    const data = { user: { id, name } };
    res.send(data); //send data.. it will be under res.data in client
  } catch (error) {
    console.error(error);
    if (error.code == 23505) {
      console.log("User already exists");
      res.status(409).json({ message: "user already exists, please signIn" });
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
    const categories = await pool.query("select name from categories");

    const data = { categories: categories.rows };
    // console.log(data)
    res.send(data);
  } catch (error) {
    console.error(error);
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
      "insert into products(category,name,description,price,stock_available,image) values ($1,$2,$3,$4,$5,$6) returning *",
      [category, name, description, price, stock_available, imagePath]
    );
    // console.log("newProduct", newProduct);
    const data = { product: newProduct.rows[0] };

    res.send(data); //send data.. it will be under res.data in client
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

//searchProducts
app.post("/search", async (req, res) => {
  // console.log("body", req.body);
  const { searchTerms } = req.body;
  let queryTerm = "";
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
});

//listen
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
