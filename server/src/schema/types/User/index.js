import gql from 'graphql-tag';

export const User = gql`
    type User implements Node {
        _id: ID!
        username: String!
        email: String!
        password: String!
        role: Role!
    }
    enum Role {
        ADMIN
        VIEWER
    }
    type AuthPayload {
        user: User!
        token: String!
    }
    input UserSignUpInput {
        username: String!
        email: String!
        password: String!
        role: Role!
    }
    input UserLoginInput {
        email: String!
        password: String!
    }
`;
