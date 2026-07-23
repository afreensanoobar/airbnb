const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js") 


const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

app.engine("ejs", ejsMate)
app.use(methodOverride("_method"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
  .then(() => {
    console.log("connected to DB")
  })
  .catch((err) => {
    console.log(err)
  })

async function main() {
  await mongoose.connect(MONGO_URL)
}


//session configuration and sending cookie 
const sessionOptions = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


app.get("/", (req, res) => {
  res.send("Hi! , I am root")
})
  
app.use(session(sessionOptions));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
} );


//listings
app.use("/listings", listings)
//reviews routes
app.use("/listings/:id/reviews", require("./routes/review.js"))


app.use( (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Oh No, Something went wrong" } = err;
res.status(statusCode).render("error.ejs", { message }); 
  // res.status(statusCode).send(message);
});

 
app.listen(8080, () => {
  console.log("server is listening   at port 8080");
}) 