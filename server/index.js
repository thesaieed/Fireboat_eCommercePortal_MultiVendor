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
  console.log("Signup Post route");
});

//listen
app.listen(5000, () => {
  console.log("Listening on Port 5000");
});
