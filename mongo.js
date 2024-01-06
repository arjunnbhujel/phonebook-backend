const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://arjunnbhujel:${password}@cluster0.0yrlrqv.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: { type: Date, default: Date.now },
})

const Phone = mongoose.model("phone", phoneSchema)

const namePerson = process.argv[3]
const numberPerson = process.argv[4]

const phone = new Phone({
  name: namePerson,
  number: numberPerson,
})

if (process.argv.length === 5) {
  phone.save().then((result) => {
    console.log(`Added ${namePerson} number ${numberPerson} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length < 4) {
  Phone.find({}).then((result) => {
    console.log("PhoneBook : ")
    result.forEach((phone) => {
      console.log(`${phone.name} --- ${phone.number}`)
    })
    mongoose.connection.close()
  })
}
