const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

//graphql
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { ApolloServer } = require('apollo-server');
const apollo = new ApolloServer({
  typeDefs,
  resolvers
});
//graphql --

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {

  logger.info('Connected to MongoDB');

  if (process.env.api_type === 'graphql') {
    server = apollo.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } else {
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  }
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
