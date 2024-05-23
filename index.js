const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

async function startServer() {
  // Define your schema
  const typeDefs = gql`
    type Book {
      title: String
      author: String
    }

    type Query {
      books: [Book]
    }
  `;

  // Define your resolvers
  const resolvers = {
    Query: {
      books: () => [
        { title: 'The Awakening', author: 'Kate Chopin' },
        { title: 'City of Glass', author: 'Paul Auster' }
      ]
    }
  };

  // Create an instance of ApolloServer
  const server = new ApolloServer({ typeDefs, resolvers });

  // Initialize an Express application
  const app = express();

  // Start the Apollo server
  await server.start();

  // Apply the Apollo GraphQL middleware to the Express server
  server.applyMiddleware({ app });

  // Define the port
  const PORT = process.env.PORT || 4000;

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer();
