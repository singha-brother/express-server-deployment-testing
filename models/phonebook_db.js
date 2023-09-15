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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 9,
    validate: {
      validator: function (value) {
        return /^(\d{2,3}-\d+)$/.test(value)
      },
      message: (props) =>
        `${props.value} is not a valid phone number. It should be in the format XX-XXXXXXXX.`,
    },
  },
})

phonebookSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    ;(returnedObj.id = returnedObj._id.toString()), delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model('Phonebook', phonebookSchema)
