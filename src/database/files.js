const {getDatabase} = require('./mongo');
const {ObjectID} = require('mongodb');

const collectionName = 'files';

async function insertFile(file) {
  const database = await getDatabase();
  const {insertedId} = await database.collection(collectionName).insertOne(file);
  return insertedId;
}

async function getFiles() {
  const database = await getDatabase();
  return await database.collection(collectionName).find({}).toArray();
}

async function deleteFile(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateFile(id, file) {
  const database = await getDatabase();
  delete file._id;
  await database.collection(collectionName).update(
    { _id: new ObjectID(id), },
    {
      $set: {
        ...file,
      },
    },
  );
}

module.exports = {
  insertFile,
  getFiles,
  deleteFile,
  updateFile
};