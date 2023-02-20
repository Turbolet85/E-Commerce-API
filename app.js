require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

//routers import
const authRouter = require('./routes/authRoutes');

//imports
const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//main middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//routes
app.get('/api/v1', (req, res) => {
   res.send('e-commerce-API');
});

app.use('/api/v1/auth', authRouter);

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
