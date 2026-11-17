const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const person = process.argv[3]
const number = process.argv[4]

const uri = `mongodb+srv://fullstack:${password}@cluster0.lb6qc7y.mongodb.net/phonebook?appName=Cluster0`;
mongoose.set('strictQuery',false)

mongoose.connect(uri)
const phonebook = new mongoose.Schema({
  id : Number,
  name : String,
  number : String
})

const Phonebook = mongoose.model('Phonebook', phonebook)

const people = new Phonebook({
  id : Math.floor(Math.random() * 1000000000),
  name : person,
  number : number
})

people.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})