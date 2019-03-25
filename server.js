var express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      axios = require('axios'),
      http = require('http');



//Routes
var configurations = require('./routes/configurations');
var variables = require('./routes/variables');
var aws = require('./routes/aws');
var sps = require('./routes/sps');
var SPSHelper = require('./helpers/SPSHelper');
//Database Variables
const DATABASE_NAME = 'perceptive'
const MONGO_DB_URL = 'mongodb://localhost:27017/';

//Mongoose Config
mongoose.PromiseProvider = require('bluebird');
mongoose.connect(MONGO_DB_URL + DATABASE_NAME, {
      useNewUrlParser: true,
      promiseLibrary: require('bluebird')
}).then(() => {
      console.log('Connection to MongoDB successful.');
}).catch((err) => {
      console.error('Cannot Connect to MongoDB Database', err);
})


const app = express();
app.use(express.static('./perceptive-console/dist/'));
app.use(bodyParser.json());
app.use(cors());

/* route middleware */
app.use('/configurations', configurations);
app.use('/variables', variables);
app.use('/videos', aws);
app.use('/sps', sps);

var server = http.Server(app);




SPSHelper.SPSAPI.getRunningSessionId().then(data => {
      console.log("Found a Running Session!");
      console.log("Started SPS Event Polling for Session ID:", data);
      SPSHelper.SPSHelper.poll(data, 0);
}).catch(err => {
      console.log("Could not find Running Session, go to http://dev.standardpatient.org" + err);
});

//Final Server Listen
server.listen(4000, () => {
      console.log("HTTP Server bound to port 4000");
})