const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("Connecting to", url)

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: { type: Date, default: Date.now },
})

phoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  },
})

module.exports = mongoose.model("Phone", phoneSchema)
