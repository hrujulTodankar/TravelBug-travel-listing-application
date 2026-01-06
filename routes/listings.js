// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner ,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js")

// INDEX - GET /listings
router.get("/", wrapAsync(listingController.index));


router.get("/new",isLoggedIn,listingController.renderNewForm );

// CREATE - POST /listings
router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// SHOW - GET /listings/:id
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT - GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editlisting));

// UPDATE - PUT /listings/:id
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE - DELETE /listings/:id
router.delete("/:id", isLoggedIn ,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
