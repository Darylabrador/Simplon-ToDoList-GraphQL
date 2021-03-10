var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');

// Config parts
const dotenv    = require('dotenv').config();
const helmet    = require('helmet');

// API configuration (middleware)
const headerApi = require('./middlewares/configApi');
const isAuthAPI = require('./middlewares/isAuthApi');

// GraphQL part
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema   = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Use middlewares
app.use(headerApi);
app.use(isAuthAPI);

// Graphql route
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: false,
  customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occurred.';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data };
  }
}));


// Error handler
app.use((error, req, res, next) => {
  const status   = error.statusCode || 500;
  const message = error.message;
  const data    = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
})


module.exports = app;