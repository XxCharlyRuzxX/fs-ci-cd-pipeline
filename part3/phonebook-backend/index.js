require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.disable("x-powered-by");
app.use(express.static('dist'))
app.use(express.json());
app.use(cors());
const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI

mongoose.connect(uri)
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} no tiene un formato de teléfono válido`
    }
  }
}
)

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

const baseUrl = "/api/persons";

app.get(baseUrl, (request, response, next) => {
  Phonebook.find({}).then(people => {
    response.json(people);
  }).catch(error => next(error));
});

app.get(`${baseUrl}/:id`, (request, response, next) => {
  Phonebook.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error));
});

app.delete(`${baseUrl}/:id`, (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id, { new: true, runValidators: true, context: 'query' }
  ).then(() => {
    response.status(204).end();
  }).catch(error => next(error));
});

app.put(`${baseUrl}/:id`, (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  }

  Phonebook.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post(`${baseUrl}`, (request, response, next) => {
  const body = request.body;

  const newPerson = new Phonebook({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  }).catch(error => next(error));
});

app.get("/info", (request, response, next) => {
  const date = new Date();
  Phonebook.countDocuments().then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} persons</p><br/><p>Date: ${date}</p>`,
    );
  }).catch(error => next(error));
});

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

const PORT = process.env.PORT;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
