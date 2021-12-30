
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', (req,res) => JSON.stringify(req.body) );

app.use(cors());
app.use(express.json());   
app.use(express.static('build'));                                                                        //middleware
app.use(morgan(':method :url :status :res[content-length] :body - :response-time ms'))
                                        

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
    },
    { 
        "id": 5,
        "name": "Hellman Truth", 
        "number": "39-23-6647122"
      }
]



app.get('/',(req,res) =>{
    //morgan(':method :url :status :res[content-length] - :response-time ms');
    res.send(`The server is runnning on ${PORT}`) });

app.get('/api/persons',(req,res) => res.json(persons))

app.get('/info',(req,res) =>  { 
    
    let total = persons.length;
    let date = new Date();
    
    res.send(`<p>Phonebook has info for ${total} people <br/><br/>  ${date}</p> ` ) } ) 

app.get('/api/persons/:id',(req,res) => {

    let id = Number(req.params.id);
    let individual = persons.find( person => person.id === id );

    if(individual === undefined)
        res.status('404').end();

    res.json(individual);

})


app.delete('/api/persons/:id',(req,res) => {

    let id =  Number(req.params.id);
    persons = persons.filter( (person) => person.id !== id  );
    res.status(204).end();

})


app.post('/api/persons',(req,res) => {
    let newPerson = req.body;

    if(!newPerson.name || !newPerson.number){
        return res.status(400).json({
            "error":"contents are misssing"
        })

    }

    if(persons.find( person => person.name === newPerson.name )){
        return res.status(400).json({
            "error":"name must be unique"
        })
    }

    newPerson["id"] = Math.floor((Math.random() * 9876543) + 12345);
    persons.push(newPerson);
    res.send(newPerson);

})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

