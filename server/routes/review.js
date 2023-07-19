const express = require("express");
const reviewRoutes = express.Router();
const pool = require("../db");

reviewRoutes.post("/newreview", async (req, res) => {
  const { rating, review, product_id, user_id } = req.body;
  // console.log(req.body);

  try {
    await pool.query(
      "INSERT into reviews(user_id, product_id, rating, review) VALUES ($1,$2,$3,$4)",
      [user_id, product_id, rating, review]
    );
    res.send(true);
  } catch (err) {
    console.error(err);
    res.send(false);
  }
});
reviewRoutes.post("/productreviews", async (req, res) => {
  const { product_id } = req.body;

  try {
    var productReviews = await pool.query(
      "SELECT * from reviews where product_id=$1",
      [product_id]
    );
    if (productReviews.rowCount === 0) {
      res.send({ allreviews: [], noOfRatings: 0, totalRating: 0 });
    } else {
      var allReviews = [];
      await productReviews.rows.map(async (review) => {
        try {
          const reviewuser = await pool.query(
            "SELECT name from users where id=$1",
            [review.user_id]
          );
          allReviews.push({ ...review, username: reviewuser.rows[0].name });
        } catch (error) {
          console.error("review user", error);
          return review;
        }
      });
      const ratings = await pool.query(
        "SELECT rating from reviews where product_id=$1",
        [product_id]
      );
      const totalRating = ratings.rowCount;
      var noOfRatings = { one: 0, two: 0, three: 0, four: 0, five: 0 };
      ratings.rows.map((rating) => {
        switch (rating.rating) {
          case 1:
            noOfRatings = { ...noOfRatings, one: noOfRatings.one + 1 };
            break;
          case 2:
            noOfRatings = { ...noOfRatings, two: noOfRatings.two + 1 };
            break;
          case 3:
            noOfRatings = { ...noOfRatings, three: noOfRatings.three + 1 };
            break;
          case 4:
            noOfRatings = { ...noOfRatings, four: noOfRatings.four + 1 };
            break;
          case 5:
            noOfRatings = { ...noOfRatings, five: noOfRatings.five + 1 };
            break;

          default:
            break;
        }
      });
      // console.log(typeof avgRating);
      // console.log(avgRating);
      res.send({ allreviews: allReviews, noOfRatings, totalRating });
    }
  } catch (err) {
    console.error(err);
    res.send({});
  }
});

reviewRoutes.post("/deletereview", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await pool.query("DELETE from reviews where user_id=$1 AND product_id=$2", [
      user_id,
      product_id,
    ]);
    res.send(true);
  } catch (err) {
    console.error(err);
    res.send(false);
  }
});

module.exports = reviewRoutes;
