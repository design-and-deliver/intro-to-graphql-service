const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const port = 4000;

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    email: String
  }

  type Query {
    user(id: ID!): User
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    user: (parent, args, context, info) => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' }
      ];
      return users.find(user => user.id === args.id);
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
