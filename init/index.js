const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelBug');
}

const initDB = async () => {
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj) => ({...obj , owner: "693a4d5e76cc82adfc62a8a7"}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized ")
}

initDB();
