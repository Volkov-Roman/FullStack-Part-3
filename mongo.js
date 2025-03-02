const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://romanvolkov:${password}@cluster0.vb5yh.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

// If only the password is given, list all entries
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.phone}`)
    })
    mongoose.connection.close()
  })
}
// If a name and number are provided, add a new entry
else if (process.argv.length === 5) {
  const name = process.argv[3]
  const phone = process.argv[4]

  const person = new Person({
    name: name,
    phone: phone,
  })

  person.save().then(() => {
    console.log(`Added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
}
// Invalid usage
else {
  console.log('Invalid number of arguments. Use either:')
  console.log('To list all entries: node mongo.js <password>')
  console.log('To add a new entry: node mongo.js <password> <name> <phone>')
  process.exit(1)
}
