const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");

// INDEX - Show all listings
module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting });
};

// NEW - Render the form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW - Detailed view of a single listing
module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid listing ID format"));
    }

    const onelisting = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        });

    if (!onelisting) {
        req.flash("error", "The listing you are looking for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { onelisting });
};

// CREATE - Save a new listing to the database
module.exports.createListing = async (req, res) => {
    const listingData = req.body.listing ?? req.body;
    
    const newListing = new Listing({
        title: listingData.title,
        description: listingData.description || listingData.desc,
        image: listingData.image && listingData.image.url ? { url: listingData.image.url } : undefined,
        price: listingData.price,
        location: listingData.location,
        country: listingData.country
    });

    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// EDIT - Render the form to edit an existing listing
module.exports.editlisting = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid listing ID format"));
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "The listing you are trying to edit does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// UPDATE - Save the edited changes to the database
module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid listing ID format"));
    }

    const updates = req.body.listing ?? req.body;
    
    // Check if listing exists before updating
    let listing = await Listing.findByIdAndUpdate(id, { ...updates }, { runValidators: true });

    if (!listing) {
        req.flash("error", "Could not update: Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// DELETE - Remove a listing from the database
module.exports.deleteListing = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid listing ID format"));
    }

    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Could not delete: Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};