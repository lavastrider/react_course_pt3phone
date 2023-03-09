require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Name = require('./model/Name')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

let persons = [

]

morgan.token('data', function stringData (request, response) { return JSON.stringify(request.body)})
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


app.get('/api/info', (request, response) => {
	const amt = String(Name.length)
	const date = new Date()
	
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
  Name.findById(request.params.id).then((izen)=> {
  	if (izen) {
  		response.json(izen)
  	} else {
  		response.status(404).end()
  	}
  	})
  	.catch((error) => next(error))
 })



app.delete('/api/persons/:id', (request, response) => {
	Name.findByIdAndRemove(request.params.id)
		.then((result) => {
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

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.phoneName || !body.phoneNumber) {
    return response.status(400).json({ 
      error: 'no name or number provided' 
    })
  }
  
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
	
	
	personal.save().then((savedEntry) => {
		response.json(savedEntry)
	})
//  persons = persons.concat(personal)

//  response.json(personal)
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	
	const personal = {
		phoneName: body.phoneName,
		phoneNumber: body.phoneNumber,
	}
	
	console.log(request.params.id, 'is request params id')

	Name.findByIdAndUpdate(request.params.id, personal, {new: true} )
		.then((updatedEntry) => {
			response.json(updatedEntry)
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
