const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const { listingSchema , reviewSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")

const validateListing = (req, res, next) => {
  // Assuming listingSchema is a Joi schema
  let { error } = listingSchema.validate(req.body); 
  if (error) {
    // Use the 'error' variable and extract the message
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get("/" ,wrapAsync(async (req , res) => {
  let alllisting =  await  Listing.find({});
  res.render("./listings/index.ejs" , { alllisting })
  }
));  


//new listing route
router.get("/new" , wrapAsync((req ,res) => {
  res.render("./listings/new.ejs");
}
));

//create route
router.post("/" , validateListing ,wrapAsync(async (req , res , next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//show route
router.get("/:id" , wrapAsync(async (req ,res) => {
  let {id} = req.params;
  let onelisting =  await Listing.findById(id).populate("reviews");
  if (!onelisting) {
    throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/show.ejs" ,{ onelisting} );
}
));

//edit route
router.get("/:id/edit" ,wrapAsync(async (req ,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id) ;
  res.render("listings/edit.ejs" , { listing });
}
));

//update route
router.put("/:id/" ,validateListing , wrapAsync(async(req ,res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing} );
  res.redirect("/listings");
}
));

//delete route
router.delete("/:id" ,wrapAsync(async (req ,res) =>{
  let {id} = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  console.log(deletedlist);
  res.redirect("/listings");
}
));

module.exports = router;