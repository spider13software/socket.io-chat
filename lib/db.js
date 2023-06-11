const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost';
const client = new MongoClient(uri);

module.exports = client;
