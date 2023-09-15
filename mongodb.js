require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('node mongodb.js password (or)')
  console.log('node mongodb.js password username password (to add)')
  process.exit()
}

// const password = process.argv[2]
// TEST WITH DOTENV
const DB_URL = process.env.REMOTE_DB_URL
// const DB_URL = `mongodb://127.0.0.1:27017/phonebook`
mongoose.set('strictQuery', false)
mongoose
  .connect(DB_URL)
  .then((_) => {
    console.log('Database Connected Successfully!')
  })
  .catch((err) => {
    console.log('Database Connection Error...', err.message)
  })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phoneSchema.set('toJSON', {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.torString()
    delete returnObj._id
    delete returnObj.__v
  },
})

const PhoneBook = mongoose.model('Phonebook', phoneSchema)

if (process.argv.length === 3) {
  PhoneBook.find({}).then((numbers) => {
    console.log(numbers)
    console.log('phonebook:')
    numbers.forEach((num) => {
      console.log(num.name, num.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const newNumber = new PhoneBook({
    name,
    number,
  })

  newNumber.save().then((result) => {
    console.log(`saved ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
