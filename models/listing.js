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
    country : String 
})

const Listing = mongoose.model("Listing" , listingSchema)
module.exports = Listing;



////     default : "https://images.unsplash.com/photo-1651181174781-e72161dd582a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set : (v) => 
    //      v === "" ? "https://images.unsplash.com/photo-1651181174781-e72161dd582a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    // 