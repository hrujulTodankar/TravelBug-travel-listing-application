const express = require("express");
const router = express.Router({mergeParams : true}); //mergeParams is used to access params from parent router
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemas.js");

//Reviews Route

const validateReview = (req, res, next) => {
  // Assuming listingSchema is a Joi schema
  let { error } = reviewSchema.validate(req.body); 
  if (error) {
    // Use the 'error' variable and extract the message
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//post route
router.post("/" , validateReview , wrapAsync( async (req , res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  console.log("new review added");
  res.redirect(`/listings/${id}`);
}));

//delete review route
router.delete("/:reviewId" , wrapAsync( async (req , res) => {
  let { id , reviewId } = req.params;
  await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId } } ); //bcoz we had to update our array in listing basically the review should be removed from the listing's reviews array
  await Review.findByIdAndDelete(reviewId); //this is to delete the review from reviews collection
  res.redirect(`/listings/${id}`);
}));

module.exports = router;