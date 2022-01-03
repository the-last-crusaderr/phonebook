const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


/*
if(process.argv.length < 3){
    console.log('Please,provide a password as an argument.')
    process.exit(1);
}
121112
const pwd = process.argv[2];
const newName = process.argv[3];
const newNum = process.argv[4];

*/

/* eslint-disable */
const url = process.env.MONGODB_URL;
/* eslint-enable */

console.log('connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });






const personSchema = new mongoose.Schema({
  id:Number,
  name:{type:String,required:true,unique:true,minLength:3},
  number:{type:String,required:true,unique:true,minLength:8}
});

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});


const PersonModel = new mongoose.model('Person',personSchema);

/*

if(!newName || !newName){
    Person.find({}).then( result => {
        result.forEach( person => console.log(person.name,person.number))
        mongoose.connection.close();
    })

}

else{


    const person = new Person({
        id: Math.floor(Math.random() * 123456),
        name:newName,
        number:newNum
})



    person.save().then( result => {
        console.log('note saved');
        mongoose.connection.close();
    })
121112

}

*/


module.exports = PersonModel;     //exporting model from this module