const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  type TokenAccess {
    token: String!
    expires: String!
  }

  type TokenRefresh {
    token: String!
    expires: String!
  }

  type Tokens {
    access: TokenAccess,
    refresh: TokenRefresh
  }

  type RegisterResponse {
    user: User
    tokens: Tokens !
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }
  input RegisterInput {
    name: String!
    password: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): RegisterResponse!
    login(username: String!, password: String!): User!
  }
`;
