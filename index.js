const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let data = require('./data')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// morgan
// Custom Morgan token to log request data as JSON
morgan.token('req-data', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return ''
})

// Use Morgan with the custom token
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-data'
  )
)

/////// ROUTES
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`Phonebook has info for\
   ${data.length} people<br/>${date.toUTCString()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id * 1
  const number = data.find((d) => d.id === id)
  if (number) {
    res.json(number)
  } else {
    res.status(404).json({
      status: 'failed',
      message: 'There is no number with that id!',
    })
  }
})

app.post('/api/persons', (req, res) => {
  const content = req.body
  const { name, number } = content
  if (name === '' || number === '') {
    res.status(400).json({
      status: 'failed',
      message: 'name and number must be filled',
    })
    return
  }

  // check name already existed
  if (data.find((d) => d.name === name)) {
    res.status(400).json({
      status: 'failed',
      message: 'name already existed',
    })
    return
  }
  //   const id = Math.random() * 100000000
  const id = Date.now()
  const newNumber = { ...content, id }
  data = [...data, newNumber]
  res.json(newNumber)
})

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id * 1
  const content = req.body
  const { name, number } = content
  data = data.map((d) => (d.id !== id ? d : { ...d, name, number }))
  res.json({ id, name, number })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id * 1
  data = data.filter((d) => d.id !== id)
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted!',
  })
})

app.listen(3000, () => {
  console.log(`http://0.0.0.0:3000`)
})
