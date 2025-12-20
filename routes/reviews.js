const express = require("express");

const router = express.Router({mergeParams : true}); //mergeParams is used to access params from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview  , isLoggedIn , isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//Create/post route
router.post("/" , isLoggedIn  , validateReview ,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId" , isLoggedIn ,isAuthor ,wrapAsync(reviewController.deleteReview));

module.exports = router;