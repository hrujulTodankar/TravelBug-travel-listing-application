const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync =require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { maxHeaderSize } = require("http");
const { wrap } = require("module");
const { clearScreenDown } = require("readline");

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
})

//index route
app.get("/listings" ,wrapAsync(async (req , res) => {
  let alllisting =  await  Listing.find({});
  res.render("./listings/index.ejs" , { alllisting })
  }
));  


//new listing route
app.get("/listings/new" , wrapAsync((req ,res) => {
  res.render("listings/new.ejs");
}
));

//create route
app.post("/listings" ,wrapAsync(async (req , res , next) => {
  if(!req.body.listing){
    throw new ExpressError(400 , "Send Valid Listing");
  }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//edit route
app.get("/listings/:id/edit" ,wrapAsync(async (req ,res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id) ;
  console.log(listing);
  res.render("listings/edit.ejs" ,{listing})
}
));

//update route
app.put("/listings/:id/edit" , wrapAsync(async(req ,res) => {
  if(!req.body.listing){
    throw new ExpressError(400 , "Send Valid Listing");
  }
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

//Show route 
app.get("/listings/:id" , wrapAsync(async (req ,res) => {
  let {id} = req.params;
  let onelisting =  await Listing.findById(id);
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