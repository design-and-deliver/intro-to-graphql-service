const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');

// Helper function to read data from the JSON file
function readData() {
  const dataFilePath = path.join(__dirname, 'db.json');
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    text: String!
    likes: Int!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    user: (parent, args) => {
      const users = readData();
      return users.find(user => user.id == args.id);
    },
    users: () => {
      return readData();
    }
  }
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  return server;
}

module.exports = startApolloServer;
