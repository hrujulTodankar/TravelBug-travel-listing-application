const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    description : String,
   image: {
        url: {
            type: String,
            // This is the key part for setting the default
            default: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
        },
        filename: {
            type: String
        }
    },

    price :Number,
    location : String ,
    country : String ,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }  
    ]
})

const Listing = mongoose.model("Listing" , listingSchema)
module.exports = Listing;
