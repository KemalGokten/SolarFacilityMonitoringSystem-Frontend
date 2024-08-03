// src/graphql/queries/users.ts
import { gql } from "@apollo/client";

// Query to get a specific user by ID
export const GET_USER = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      username
      email
    }
  }
`;

// Query to verify the token and get user details
export const VERIFY_TOKEN = gql`
  query VerifyToken {
    verifyToken {
      id
      username
      email
    }
  }
`;

// Mutation to register a new user
export const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
  ) {
    regUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

// Mutation to login a user
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

// Mutation to update an existing user
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: String!
    $username: String
    $email: String
    $password: String
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      password: $password
    ) {
      id
      username
      email
    }
  }
`;

// Mutation to delete a user
export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      success
      message
      id
    }
  }
`;

// Mutation to request password reset
export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

// Mutation to reset password
export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;
