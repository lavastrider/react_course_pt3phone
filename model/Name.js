const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const nameSchema = new mongoose.Schema({
  phoneName: {
    type: String,
    minLength: [3, 'The name must be at least 3 letters'],
    required: true
  },
  phoneNumber: {
    type: String,
    minLength: [8, 'The number must be at least 8 numbers'],
    validate: {
      validator: function (pN) {
        if (pN.includes('-')) {
          return /\d{2}-\d+|\d{3}-\d+/.test(pN)
        }
        else {
          return /\d{8,}/.test(pN)
        }
      },
      message: 'This is not a valid format'
    },
    required: true
  }
})

nameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Name', nameSchema)