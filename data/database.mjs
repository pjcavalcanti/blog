import { MongoClient, ObjectId } from 'mongodb';
import MongoStore from 'connect-mongo';

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const store = MongoStore.create({
  mongoUrl: url + '/blog_session',
});

async function connectDb() {
  try {
    await client.connect();
    store.on('error', function(error) {
      console.log(error);
    })
  } catch (error) {
    console.log(error);
  }
}

function getDb() {
  return client.db('blog');
}

function getStore() {
  return store;
}

export { connectDb, getDb, getStore, ObjectId };
