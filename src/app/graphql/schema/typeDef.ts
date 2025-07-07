import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    inStock: Boolean!
    image: String!
    description: String!
    category: String!
    brand: String!
    rating: Float!
  }

  type Query {
    users: [User]!
    user(id: ID!): User!
    products: [Product]!
    product(id: ID!): Product!
  }

  type Mutation {
    addProduct(name: String!, price: Float!, description: String!, category: String!, brand: String!, rating: Float!, inStock: Boolean!, image: String!): Product!
  }
`;
