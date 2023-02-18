require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
//imports
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const morgan = require('morgan');

//main middleware
app.use(morgan('tiny'));
app.use(express.json());

//routes
app.get('/', (req, res) => {
   res.send('e-commerce-API');
});

//custom middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

//start app
const port = process.env.PORT || 3000;
const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, console.log(`Server is listening on port: ${port}...`));
   } catch (error) {
      console.log(error);
   }
};
start();
