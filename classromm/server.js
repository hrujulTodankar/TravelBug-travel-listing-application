const express   = require("express");
const cookieParser = require("cookie-parser");
const { PawPrint } = require("lucide-react");
// const users = require("./routes/users.js");
// const post  = require("./routes/posts.js");

const app = express();
app.use(cookieParser("Secretcode"));

app.get("/getsignedcookie" , (req , res) => {
    res.cookie("username" , "johnDoe123" , { signed : true });
    res.cookie("madeIn" , "India" , { signed : true });
    console.log(req.signedCookies);
    res.send("requested signed cookies ");
});

app.get("/verifysignedcookie" , (req , res) => {
    console.log("Signed Cookies :" , req.signedCookies);
    res.send(req.cookies);    
});

app.get("/getcookie" , (req , res) => {
    res.cookie("username" , "johnDoe123");
    res.cookie("madeIn" , "India");
    console.log(req.cookies);
    res.send(req.cookies);
});

// //use routes 

// app.use("/users" , users);
// app.use("/posts" , post);

app.listen(3000 , () => {
    console.log("Server started at port 3000");
});

app.get ("/" , (req , res) => {
    res.send("Welcome to root route");
    console.dir("Cookies :" , req.cookies);
});