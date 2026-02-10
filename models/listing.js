const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    description : String,
   image: {
        url: String,
        filename: String
    },

    price :Number,
    location : String ,
    country : String ,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }  
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.post("findOneAndDelete" , async function(listing) { //whenever a listing is deleted , this middleware will be called
    if(listing) {
        await Review.deleteMany({
            _id : { $in : listing.reviews }   //deleting all reviews whose _id is in listing.reviews array
        })
    }
});

const Listing = mongoose.model("Listing" , listingSchema)
module.exports = Listing;
