// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
const listingController = require("../controllers/listings.js")

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


// NEW - GET /listings/new
router.get("/new",wrapAsync(listingController.renderNewForm ));

// EDIT - GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editlisting));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn , isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn ,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;

