// const MongoClient = require('mongodb').MongoClient;
//
// const url = 'mongodb://localhost:27017';
// const dbName = 'jinduTrain';
//
// module.exports = async function getDBService () {
//     const client = await MongoClient.connect(url);
//     return client.db(dbName);
// };


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jinduTrain');

const db = mongoose.connection;

db.on('open', () => {
    console.log('connected db: jinduTrain');
});