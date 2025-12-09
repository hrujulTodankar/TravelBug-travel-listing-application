const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const UserSchema = new Schema({ //username and password is automatically created because 
                                 // Passport-Local Mongoose will add a username, hash and salt field to store the username, 
                                 // the hashed password and the salt value.
    email: {
        type: String,
        required: true,
        unique: true
    }

});
UserSchema.plugin(passportLocalMongoose); // actually adds the hashed username and password fields to the schema
module.exports = mongoose.model("User", UserSchema);