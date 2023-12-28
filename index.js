const express = require("express")
const app = express()
var morgan = require("morgan")

app.use(express.json())

// morgan.token("body", function (req, res) {
//   // console.log(req.body)
//   return JSON.stringify(req.body)
// })

// Optimized code ↓
morgan.token("body", (req) => JSON.stringify(req.body))

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

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

const idChecker = (id) => {
  let existing = [...phoneBook.map((phone) => phone.id)]
  return existing.includes(id)
}

const generateId = () => {
  const max = 50 //Max Id Number can be changed as per needs.
  const randomId = Math.floor(Math.random() * max)
  if (idChecker(randomId)) {
    return generateId()
  } else {
    return randomId
  }
}

const nameChecker = (name) => {
  let existingName = [...phoneBook.map((phone) => phone.name.toLowerCase())]
  return existingName.includes(name.toLowerCase())
}

const numberChecker = (number) => {
  let existingNumber = [...phoneBook.map((phone) => phone.number)]
  return existingNumber.includes(number)
}

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>")
})

app.get("/api/persons", (req, res) => {
  res.json(phoneBook)
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
  const id = Number(req.params.id)
  const phoneNumber = phoneBook.find((num) => num.id === id)

  if (phoneNumber) {
    res.json(phoneNumber)
  } else {
    res
      .status(404)
      .send("Sorry the person does not exist in the system, try other id.")
  }
})

app.post("/api/persons", (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: "Please Enter the Person Name",
    })
  } else if (nameChecker(body.name)) {
    return res.status(400).json({
      error: "Person already exist in phonebook, please add new person",
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: "Please Enter the Person Number",
    })
  } else if (numberChecker(body.number)) {
    return res.status(400).json({
      error: "Number already exist in phonebook, please add new number",
    })
  }

  let phoneDetail = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  phoneBook = phoneBook.concat(phoneDetail)
  res.json(phoneDetail)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Web server Running at port ${PORT}`)
})
