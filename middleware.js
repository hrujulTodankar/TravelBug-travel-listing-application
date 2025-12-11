module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access that page!");
    return res.redirect("/login");
  }
  next();
};

// module.exports.isOwner = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   if (!listing.owner.equals(res.locals.currUser._id)) {
//     req.flash("error", "You are not the owner of this listing!");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// };           
module.exports.validateListing = (req, res, next) => {