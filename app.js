const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./models/review.js");
const { listingSchema , reviewSchema } = require("./schemas.js");
// const { maxHeaderSize } = require("http");
// const { wrap } = require("module");
// const { clearScreenDown } = require("readline");

main().then(() => {
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelBug');
}

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

app.get("/" , (req ,res) => {
    res.send("working root");
});

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

//index route
app.get("/listings" ,wrapAsync(async (req , res) => {
  let alllisting =  await  Listing.find({});
  res.render("./listings/index.ejs" , { alllisting })
  }
));  


//new listing route
app.get("/listings/new" , wrapAsync((req ,res) => {
  res.render("./listings/new.ejs");
}
));

//create route
app.post("/listings" , validateListing ,wrapAsync(async (req , res , next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//edit route
app.get("/listings/:id/edit" ,wrapAsync(async (req ,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id) ;
  res.render("listings/edit.ejs" , { listing });
}
));

//update route
app.put("/listings/:id/" ,validateListing , wrapAsync(async(req ,res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing} );
  res.redirect("/listings");
}
));

//delete route
app.delete("/listings/:id" ,wrapAsync(async (req ,res) =>{
  let {id} = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  console.log(deletedlist);
  res.redirect("/listings");
}
));

//Reviews Route
//post route
app.post("/listings/:id/reviews" , validateReview , wrapAsync( async (req , res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new review(req.body.review);
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  //res.redirect(`/listings/${id}`);
  console.log("new review added");
  res.send("Review added successfully");
}));

//Show route
app.get("/listings/:id" , wrapAsync(async (req ,res) => {
  let {id} = req.params;
  let onelisting =  await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs" ,{ onelisting} );
}
));


app.use((err , req , res , next) => {
  let {statuscode = 500 , message = "Something went wrong"} = err ;
  res.status(statuscode).render("./listings/error.ejs" , { message })
});


app.listen(8080 , () => {
    console.log("server is listening to port 8080");
})