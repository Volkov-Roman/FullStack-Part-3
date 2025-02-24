const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook application</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length;
    const currentTime = new Date().toLocaleString()
  
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <br/>
      <p>${currentTime}</p>
    `)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.statusMessage = "Overriden NOT FOUND message"
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.phone) {
    return response.status(400).json({ 
      error: 'Name or number is missing' 
    })
  }

  const nameExists = persons.some(person => person.name === body.name)
  if (nameExists) {
    return response.status(400).json({
      error: 'Name already exists in the phonebook'
    })
  }

  const person = {
    id: String(Math.floor(Math.random() * 1_000_000_000)),
    name: body.name,
    phone: body.phone
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
