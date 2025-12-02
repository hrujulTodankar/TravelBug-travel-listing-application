const express   = require("express");
const cookieParser = require("cookie-parser");
const { PawPrint } = require("lucide-react");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const path = require("path");

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname , "views"));

app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    if(name === "anonymous"){
        req.flash("error", "Name cannot be anonymous");
    }else{
        req.flash("success", "You have been registered successfully");
    }
    req.session.name = name;
    res.redirect("/hello");
});

app.get ("/hello", (req, res) => {
    res.render("page.ejs" , { name : req.session.name });   
});




// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//         res.send(`you sent a request ${req.session.count} times`);
//         return;
//     } else{
//        req.session.count = 1;
//         res.send(`you sent a request ${req.session.count} times`);
//         return;
//     }
// });

app.listen(3000 , () => {
    console.log("Server started at port 3000");
});
