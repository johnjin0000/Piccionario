const mongoose = require('mongoose');

//User Schema
const WordsSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  words:[{
    type: String,
    required: true
  }]
});

const Words = module.exports = mongoose.model('Words', WordsSchema);
