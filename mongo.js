const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const entryName = process.argv[3]
const entryNumber = process.argv[4]
	
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)
	.then((result) => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDb', error.message)
	})

const nameSchema = new mongoose.Schema({
  phoneName: String,
  phoneNumber: String,
})

//console.log(testing, 'is testing')

const Name = mongoose.model('Name', nameSchema)

const nameEntry = new Name({
  phoneName: entryName,
  phoneNumber: entryNumber,
})

//name.save().then(result => {
//  console.log('name saved!')
//  mongoose.connection.close()
//})

if (process.argv.length == 3) {
	console.log('phonebook:')
	Name.find({}).then(result => {
	  result.forEach(izen => {
	    console.log(`${izen.phoneName} ${izen.phoneNumber}`)
	  })
	  mongoose.connection.close()
	})
}

if (process.argv.length == 4) {
	console.log('we are missing full new entry')
	process.exit(1)
}

if (process.argv.length == 5) {
	console.log(entryName, 'is entry name')
	console.log(entryNumber, 'is entry number')
	nameEntry.save().then(result => {
		console.log(result, 'is result in save')
		console.log(`The name ${entryName} was added to the phonebook`)
		mongoose.connection.close()
	})
}