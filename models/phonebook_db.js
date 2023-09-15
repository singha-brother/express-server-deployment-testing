const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.REMOTE_DB_URL
console.log('Connecting to ', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log('Successfully connected to Database')
  })
  .catch((err) => {
    console.log('Error in connection Database', err.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phonebookSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    ;(returnedObj.id = returnedObj._id.toString()), delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model('Phonebook', phonebookSchema)
