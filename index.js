require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const Phone = require("./models/phone")

var morgan = require("morgan")

// const Phone = mongoose.model("Phone", phoneSchema)

app.use(cors())
app.use(express.json())
app.use(express.static("build"))

// Configuring Morgan Logging

morgan.token("body", function (req, res) {
  // console.log(req.body)
  return JSON.stringify(req.body)
})

// Optimized code ↓
// morgan.token("body", (req) => JSON.stringify(req.body))

const logFunction = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens["response-time"](req, res),
    "ms",
    tokens.body(req, res),
  ].join(" ")
}

app.use(morgan(logFunction))

// const nameChecker = (name) => {
//   let existingName = [...phoneBook.map((phone) => phone.name.toLowerCase())]
//   return existingName.includes(name.toLowerCase())
// }

// const numberChecker = (number) => {
//   let existingNumber = [...phoneBook.map((phone) => phone.number)]
//   return existingNumber.includes(number)
// }

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>")
})

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((book) => {
    res.json(book)
  })
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  phoneBook = phoneBook.filter((phone) => phone.id !== id)
  res.status(204).end()
})

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${phoneBook.length} people <br> ${Date()}
  </p>`
  )
})

app.get("/api/persons/:id", (req, res) => {
  Phone.findById(req.params.id).then((phone) => {
    res.json(phone)
  })
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: "Please Enter the Person Name",
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "Please Enter the Person Number",
    })
  }

  // if (body.content === undefined) {
  //   return res.status(400).json({ error: "content missing" })
  // }

  console.log(body)
  const phoneDetail = new Phone({
    name: body.name,
    number: body.number,
  })
  phoneDetail.save().then((savedDetail) => {
    res.json(savedDetail)
    console.log(savedDetail)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
