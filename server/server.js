const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const faker = require("faker");
const typeDefs = gql`
  type Tag {
    id: Int
    label: String
  }
  type Query {
    hello: String
    tags: [Tag]
    ping(message: String!): String
  }

  type Mutation {
    addTag(label: String!): Tag
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;
// 生成一些标签
var id = 0;
var tags = [];
for (let i = 0; i < 42; i++) {
  addTag(faker.random.word());
}

function addTag(label) {
  let t = {
    id: id++,
    label,
  };
  tags.push(t);
  return t;
}
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    ping(root, { message }, context) {
      return `Answering ${message}`;
    },
    tags(root, args, context) {
      return tags;
    },
  },
  Mutation: {
    addTag(root, { label }, context) {
      console.log(`adding tag '${label}'`);
      return addTag(label);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log("Now browse to http://localhost:4000" + server.graphqlPath)
);
