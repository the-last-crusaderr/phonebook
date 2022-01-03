const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const PersonMod = require('./models/persons');



const app = express();


morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());                                                                         //middleware
app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'));








app.get('/', (req, res) => {
  res.send(`The server is runnning on ${PORT}`);
});

app.get('/api/persons', (req, res) => {
  PersonMod.find({}).then(data => res.json(data));
}
);



app.get('/info', (req, res) => {

  let date = new Date();

  PersonMod.find({}).then(elem => res.send(`<p>Phonebook has info for ${elem.length} people <br/><br/>  ${date}</p> `));
});


app.get('/api/persons/:id', (req, res, next) => {

  let reqId = Number(req.params.id);
  PersonMod.find({ 'id': reqId }).then(data => {
    console.log(data);              //
    if (!data)
      return res.status(404).end();
    else
      res.send(data);
  }).catch(error => next(error));

});


app.delete('/api/persons/:id', (req, res, next) => {
  PersonMod.findOneAndRemove({ 'id': req.params.id })
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});


app.put('/api/persons/:id', (req, res, next) => {

  let newPerson = { 'id': req.params.id, 'name': req.body.name, 'number': req.body.number };

  PersonMod.findOneAndRemove({ 'id': req.params.id })
    .then()
    .catch(error => next(error));


  const person = new PersonMod({
    id: req.params.id,
    name: newPerson.name,
    number: newPerson.number
  });

  person.save().then(data => res.send('person saved.'))
    .catch(error => {
      console.log(error);
      res.status(400);
    });
});





app.post('/api/persons', (req, res, next) => {
  let newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      'error': 'contents are misssing'
    });

  }

  const person = new PersonMod({
    id: Math.floor(Math.random() * 9123456),
    name: newPerson.name,
    number: newPerson.number
  });

  person.save().then(data => res.send('person saved.'))
    .catch(error => next(error));


});



//implementing errorHandler from scratch

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);



/* eslint-disable */
const PORT = process.env.PORT || 3002;
/* eslint-enable */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



