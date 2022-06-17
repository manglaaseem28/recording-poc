
const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const appConfig = require("./src/config");

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// Adding routes for HTTP/HTTPS calls
console.log("routes ----------- ", `./routes`)
require(`./src/routes/event.route`)("/api", app);

// adding morgan to log HTTP requests
app.use(morgan('combined'));


// starting the server
app.listen(appConfig.SERVER_PORT, () => {
  console.log(`Node service running on port ${appConfig.SERVER_PORT}`);
})
