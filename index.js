require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const Phone = require("./models/phone")

var morgan = require("morgan")

app.use(express.static("build"))
app.use(express.json())
app.use(cors())

// Configuring Morgan Logging

morgan.token("body", function (req, res) {
  // console.log(req.body)
  return JSON.stringify(req.body)
})

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

//getting api data in Localhost

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>")
})

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((book) => {
    // console.log(book)
    res.json(book)
  })
})

app.delete("/api/persons/:id", (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id)
    .then((response) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get("/info", (req, res) => {
  Phone.find({}).then((book) => {
    res.send(
      `<p>Phonebook has info for ${book.length} people <br> ${Date()}
    </p>`
    )
  })
})

app.get("/api/persons/:id", (req, res) => {
  Phone.findById(req.params.id)
    .then((phone) => {
      if (phone) {
        res.json(phone)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
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

  app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body

    const contact = {
      name: body.name,
      number: body.number,
      date: new Date(),
    }

    Phone.findByIdAndUpdate(req.params.id, contact, { new: true })
      .then((updatedContact) => {
        console.log(updatedContact)
        res.json(updatedContact)
      })
      .catch((error) => next(error))
  })

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

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
