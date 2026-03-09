if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}


const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/travelBug";
const MONGODB_ATLAS_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGODB_ATLAS_URL);
}

const initDB = async () => {
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({...obj , owner: "693a4d5e76cc82adfc62a8a7"}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
}

main()
  .then(() => {
    console.log("connected to DB");
    return initDB();
  })
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
