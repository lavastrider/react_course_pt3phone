require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
const Name = require('./model/Name')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

//let persons = [
//
//]

morgan.token('data', function stringData (request) { return JSON.stringify(request.body)})
//morgan.token('data', function stringData (request, response) { return JSON.stringify(request.body)})
//morgan.token('type', function stringData (request, response) { return request.headers['content-type']})

app.use(morgan(function tokenPost(tokens, request, response) {
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
    tokens.data(request, response)
  ].join(' ')
}))

const date = new Date()

app.get('/api/info', async (request, response) => {
//	console.log(Name.length, 'is Name length') <- outputs as 3
//	console.log(db.collection.count(), 'is db collection count') <- outputs as db undefined
//	console.log(db.test.count(), 'is db collection count') <- db is undefined

  console.log(Name.countDocuments(), 'is names countdocuments')
  //	console.log(Name.countDocuments().map((collect) => collect.collectionName === "names"), 'is names countdocuments map collect collectionname equals names')
  //	console.log(Name.names.countDocuments().length, 'is name names countdocuments length')

  const amt = await Name.countDocuments({})
  //	const date = new Date()

  console.log(typeof date, 'is date type')

  if (amt) {
    response.send(`<p>The phonebook has information on ${amt} people <br></br> ${date}</p>`)
  }
  //	response.send('<p>The phonebook has {amt} entries</p>')
  //	response.send(Date())

//	response.end()
})


app.get('/api/persons', (request, response) => {
  Name.find({}).then((nume) => {
    response.json(nume)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Name.findById(request.params.id).then((izen) => {
    if (izen) {
      response.json(izen)
    } else {
      response.status(404).end()
    }
  })
    .catch((error) => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  Name.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
  //  const id = Number(request.params.id)
  // persons = persons.filter((indiv) => indiv.id !== id)

//  response.status(204).end()
})

const generateId = () => {
  //gen new id with math.random function
  const ident = Math.floor(Math.random() * 100)
  return ident
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //  if (!body.phoneName || !body.phoneNumber) {
  //    return response.status(400).json({
  //      error: 'no name or number provided'
  //    })
  //  }

  //  console.log(persons.filter((nomen) => nomen.name===body.name), 'is the persons filter test')
  //  console.log(body.phoneName, 'is body name')

  // if (persons.filter((nomen) => nomen.phoneName===body.phoneName).length === 1) {
  //	console.log('we found a match')
  //  	return response.status(400).json({
  // 		error: 'that name already exists'
  //  	})
  //  }

  const personal = new Name({
    phoneName: body.phoneName,
    phoneNumber: body.phoneNumber,
    id: generateId(),
  })


  personal.save()
    .then((savedEntry) => {
      response.json(savedEntry)
    })
    .catch((error) => next(error))
  //  persons = persons.concat(personal)

//  response.json(personal)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { phoneName, phoneNumber } = request.body
  console.log(phoneName, 'is phoneName')
  console.log(phoneNumber, 'is phoneNumber')

  //	const personal = {
  //		phoneName: body.phoneName,
  //		phoneNumber: body.phoneNumber,
  //	}

  console.log(request.params.id, 'is request params id')

  Name.findByIdAndUpdate(request.params.id, { phoneName, phoneNumber }, { new: true, runValidators: true, context: 'query' } )
    .then((updatedEntry) => {
      response.json(updatedEntry)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
