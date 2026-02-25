const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({ //username and password is automatically created because
                                 // Passport-Local Mongoose will add a username, hash and salt field to store the username,
                                 // the hashed password and the salt value.
    email: {
        type: String,
        required: true,
        unique: true
    }

});

UserSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);