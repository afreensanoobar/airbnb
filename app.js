const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")

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

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
  res.send("Hi! , I am root")
})
//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs", { allListings })
})
// NEW route first
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs")
})

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing)
  await newListing.save()
  res.redirect("/listings")
})
//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params
  const listing = await Listing.findById(id)
  res.render("listings/edit.ejs", { listing })
})

//Update Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect(`/listings/${id}`)
})

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params
  await Listing.findByIdAndDelete(id)
  res.redirect("/listings")
})
// SHOW route after
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  res.render("listings/show.ejs", { listing })
})
//Test Route to create a sample listing

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New villa ",
//     description: "By the Beach",
//     price: 1200,
//     location: "Calangate , Goa ",
//     country: "India",
//   })
//   await sampleListing.save()
//   console.log("sample was saved")
//   res.send("successfull saved")
// })

app.listen(8080, () => {
  console.log("server is listening   at port 8080")
})
