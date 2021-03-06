// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

const {startDatabase} = require('./database/mongo');
const {insertFile, getFiles, deleteFile, updateFile} = require('./database/files');

//Setup JWT checking
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-4cam54-k.eu.auth0.com/.well-known/jwks.json'
}),
audience: 'https://files-transfer',
issuer: 'https://dev-4cam54-k.eu.auth0.com/',
algorithms: ['RS256']
});

// authenticate requests
app.use(jwtCheck);

// endpoint responsible for the GET requests
app.get('/', async (req, res) => {
  res.send(await getFiles());
});

// end point to add file
app.post('/', async (req, res) => {
    const newFile = req.body;
    await insertFile(newFile);
    res.send({ message: 'New file inserted.' });
  });

// endpoint to delete an file
app.delete('/:id', async (req, res) => {
    await deleteFile(req.params.id);
    res.send({ message: 'File removed.' });
  });
  
  // endpoint to update an file
  app.put('/:id', async (req, res) => {
      try {
        const updatedFile = req.body;
        await updateFile(req.params.id, updatedFile);
        res.send({ message: 'File updated.' });   
      } catch (error) {
          console.error(error)
      }
  });

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertFile({title: 'Hello, now from the in-memory database!'});

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});

