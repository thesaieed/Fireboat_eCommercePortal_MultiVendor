const express = require("express");
const pool = require("./db"); //database include
const cors = require("cors"); //used for handing trasmission json data from server to client

const app = express(); // running app
app.use(cors());
app.use(express.json());

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
        //if password matches, delete password field and send that obj to user with another field loginStatus set to 200. this variable will be used in cliet side for verification
        delete foundUser.rows[0].password;
        // console.log("foundUser : ", foundUser.rows[0]);
        data = { loginStatus: 200, user: foundUser.rows[0] };
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
  const { name, email, password, phone } = req.body;

  try {
    const newUser = await pool.query(
      "insert into users(name,email,password,phone) values ($1,$2,$3,$4) returning *",
      [name, email, password, phone]
    );
    console.log("newUSer", newUser);
    const data = { user: newUser.rows[0] };

    res.send(data); //send data.. it will be under res.data in client
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: "user already exists, please signIn" });
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

app.get("/admin/categories", async(req,res) =>{
  try {
    const categories = await pool.query(
      'select name from categories'
    )

    const data = {categories: categories.rows}
    console.log(data)
    res.send(data)
    
  } catch (error) {
    console.error(error)
  }
})

//AddProduct handling

app.post("/admin/addproduct", async (req, res) => {
  const {category, name, description, price, stock_available } = req.body;

  try {
    const newProduct = await pool.query(
      "insert into products(category,name,description,price,stock_available) values ($1,$2,$3,$4,$5) returning *",
      [category,name, description, price, stock_available]
    );
    // console.log("newProduct", newProduct);
    const data = { product: newProduct.rows[0] };

    res.send(data); //send data.. it will be under res.data in client
  } catch (error) {
    console.error(error);
  }
});




//listen
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
