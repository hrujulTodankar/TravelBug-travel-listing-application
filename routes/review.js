const express = require("express");
const router = express.Router({mergeParams : true}); //mergeParams is used to access params from parent router
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview  , isLoggedIn , isAuthor} = require("../middleware.js");


//post route
router.post("/" , isLoggedIn  , validateReview ,wrapAsync( async (req , res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  req.flash("success" , "New Review Created");
  return res.redirect(`/listings/${id}`);
}));

//delete review route
router.delete("/:reviewId" , isLoggedIn ,isAuthor ,wrapAsync( async (req , res) => {
  let { id , reviewId } = req.params;
  await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId } } ); //bcoz we had to update our array in listing basically the review should be removed from the listing's reviews array
  await Review.findByIdAndDelete(reviewId); //this is to delete the review from reviews collection
  req.flash("success" , "Review Deleted");
  return res.redirect(`/listings/${id}`);
}));

module.exports = router;