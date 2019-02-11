var express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      axios = require('axios');

      
//Routes
var configurations = require('./routes/configurations');
var variables = require('./routes/variables');
var aws = require('./routes/aws');
//Database Variables
const DATABASE_NAME = 'perceptive'
const MONGO_DB_URL = 'mongodb://localhost:27017/';

//Mongoose Config
mongoose.PromiseProvider = require('bluebird');
mongoose.connect(MONGO_DB_URL + DATABASE_NAME,{
      useNewUrlParser : true,
      promiseLibrary : require('bluebird')
}).then(()=>{
      console.log('Connection to MongoDB successful');
}).catch((err)=>{
      console.error(err);
})


const app = express();
app.use(express.static('./perceptive-console/dist/'));
app.use(bodyParser.json());
app.use(cors());

/* route middleware */
app.use('/configurations', configurations);
app.use('/variables',variables);
app.use('/videos', aws);


app.listen(4000, ()=> {
      console.log("Express Server Started");
})