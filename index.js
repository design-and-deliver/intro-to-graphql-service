const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const restApi = require('./restApi');

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Use the REST API routes
app.use('/api', restApi);

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }
`;

// Helper function to read data from the JSON file
function readData() {
  const dataFilePath = path.join(__dirname, 'data.json');
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Define the resolvers
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      const users = readData();
      return users.find(user => user.id == args.id);
    },
    users: () => {
      return readData();
    }
  }
};

async function startServer() {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    playground: true, // Enables Apollo Studio Explorer
    introspection: true // Allows introspection for the schema
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
