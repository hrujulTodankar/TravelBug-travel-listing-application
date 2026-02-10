// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const { isLoggedIn , isOwner ,validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js")

router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));
.post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
});

// NEW - GET /listings/new
router.get("/new",wrapAsync(listingController.renderNewForm ));

// EDIT - GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editlisting));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn , isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn ,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;

