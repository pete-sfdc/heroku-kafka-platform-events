// node packages
const path = require('path');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const websocketService = require('./services/websocketService');

// this will do route magic
const app = express();

// establish connection to Salesforce and subscribe to event streams
const sfdcInitUtils = require('./utils/sfdcInitUtils');

// resolve port
const port = process.env.PORT || 5000;

// serve static files from the react app
app.use(express.static(path.resolve('./client/build')));

// use morgan callout logger
app.use(logger('dev'));

// parse JSON right away
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routing middleware
const appRoutes = require('./routes/app.js');

// use middleware for routes
app.use('/', appRoutes);

// catch-all returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client/build/index.html'));
});

const server = require('http').createServer(app);

// start the server
// uses config var PORT
server.listen(port);

// spin up the websockets
websocketService.init(server);
