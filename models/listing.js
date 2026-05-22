const mongoose = require("mongoose")
const Schema = mongoose.Schema

const defaultImage =
  "https://media.istockphoto.com/id/942487972/photo/sunrise-over-caribbean-beach-mayan-riviera-mexico.jpg?s=1024x1024&w=is&k=20&c=9GdZ9cSNWkmDXw3c1SZrv_I-Mb4A-isMFdB_rnDrKG0="

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: defaultImage,
    set: (v) => {
      if (!v) return defaultImage
      if (typeof v === "object") return v.url || defaultImage
      if (v === "") return defaultImage
      return v
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing
  