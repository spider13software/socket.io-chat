const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost';
const client = new MongoClient(uri);

async function getUserList(condition) {
  const database = client.db('chatdb');
  const usersCollection = database.collection('users');
  let list = await usersCollection.find(condition || {}).toArray();
  list = list.map((user) => {
    return {
      id: user._id.toString(),
      login: user.login,
      password: user.password,
    };
  });
  return list;
}

module.exports = {
  getUserList,
  client,
};
