const express = require("express");
const pool = require("./db"); //database include
const cors = require("cors"); //used for handing trasmission json data from server to client

const app = express(); // running app
app.use(cors());
app.use(express.json());

//login route
app.post("/login", async (req, res) => {
  console.log("login Post route");
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
    res.status(401).json({ message: "user already exists, please signIn" });
  }
});


//listen
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
