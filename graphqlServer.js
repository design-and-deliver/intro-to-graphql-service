const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');

// Helper function to read data from the JSON file
function readData() {
  const dataFilePath = path.join(__dirname, 'db.json');
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
}

// Helper function to write data to the JSON file
function writeData(data) {
  const dataFilePath = path.join(__dirname, 'db.json');
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Define the schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    text: String!
    likes: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    id: ID!
    successMessage: String
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    user: (parent, args) => {
      const users = readData();
      return users.find(user => user.id === args.id);
    },
    users: () => {
      return readData();
    }
  },
  Mutation: {
    createUser: (parent, args) => {
      const users = readData();
      const newUser = {
        id: (users.length + 1).toString(),
        name: args.name,
        email: args.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        posts: []
      };
      users.push(newUser);
      writeData(users);
      return newUser;
    },
    updateUser: (parent, args) => {
      const users = readData();
      const userIndex = users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      const updatedUser = {
        ...users[userIndex],
        ...args,
        updatedAt: new Date().toISOString()
      };
      users[userIndex] = updatedUser;
      writeData(users);
      return updatedUser;
    },
    deleteUser: (parent, args) => {
      const users = readData();
      const userIndex = users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      const deletedUser = users.splice(userIndex, 1)[0];
      writeData(users);
      return { id: deletedUser.id, successMessage: "User successfully deleted" };
    }
  }
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  return server;
}

module.exports = startApolloServer;
