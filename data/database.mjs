import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// console.log("AA");
// 
// client.connect().then(result => {  
//   console.log(result);
// }).catch(error => {
//   console.log(error);
// }).finally(() => client.close());

async function connect() {
  try {
    await client.connect();
  } catch (error) {
    console.log(error);
  }
}

function getDb() {
  return client.db('blog');
}

export { connect, getDb };
