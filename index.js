require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Name = require('./model/Name')

const url =
  `mongodb+srv://fullstack:memyselfi@phonebook.af4bf3f.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
	

const Names = mongoose.model('Name', nameSchema)


//const requestLogger = (request, response, next) => {
//  console.log('Method:', request.method)
//  console.log('Path:  ', request.path)
//  console.log('Body:  ', request.body)
//  console.log('---')
//  next()
//}

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


const requestLogMorg = (request, response, next, testing) => {
	morgan('tiny')
	morgan.token(testing)
	next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
//app.use(requestLogger)
//app.use(requestLogMorg)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/info', (request, response) => {
	const amt = String(persons.length)
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

app.get('/api/persons/:id', (request, response) => {
  Name.findById(request.params.id).then((izen)=> {
  	response.json(izen)
  	})
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((indiv) => indiv.id !== id)

  response.status(204).end()
})

const generateId = () => {
  //gen new id with math.random function
  const ident = Math.floor(Math.random() * 100)
  return ident
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'no name or number provided' 
    })
  }
  
  console.log(persons.filter((nomen) => nomen.name===body.name), 'is the persons filter test')
  console.log(body.name, 'is body name')
 
  
 if (persons.filter((nomen) => nomen.name===body.name).length === 1) {
	console.log('we found a match') 
  	return response.status(400).json({
 		error: 'that name already exists'
  	})
  }

  const personal = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(personal)

  response.json(personal)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
