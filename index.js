const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const restApi = require('./restApi');
const startApolloServer = require('./graphqlServer');

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Use the REST API routes
app.use('/api', restApi);

// Start Apollo Server
startApolloServer().then((server) => {
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
});
