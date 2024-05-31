const { ApolloServer, gql } = require('apollo-server-express');

// Sample type definitions and resolvers
const typeDefs = gql`
    type Item {
        id: ID!
        name: String!
    }

    type Query {
        items: [Item]
    }

    type Mutation {
        addItem(id: ID!, name: String!): Item
    }
`;

let items = [];

const resolvers = {
    Query: {
        items: () => items,
    },
    Mutation: {
        addItem: (_, { id, name }) => {
            const newItem = { id, name };
            items.push(newItem);
            return newItem;
        }
    }
};

async function startApolloServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    return server;
}

module.exports = startApolloServer;
