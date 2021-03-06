import { gql } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  pubsub,
  AUTHOR_CREATED,
  APP_SECRET,
  AUTHOR_UPDATED,
  notAuthorized,
} from '../utils';

export const Mutation = gql`
  type Mutation {
    login(credentials: UserLoginInput): AuthPayload
    signup(credentials: UserSignUpInput): AuthPayload
    addAuthor(author: AuthorInput!): Author
    updateAuthor(author: AuthorUpdateInput!): Author
  }
`;

export const mutationResolvers = {
  signup: async (parent, { credentials }, context) => {
    const { username, email, password, role } = credentials;
    const user = await context.models.mongo.User.create(
      {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        role,
      },
      context,
    );

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      APP_SECRET,
      { expiresIn: '1y' },
    );

    return { user, token };
  },
  login: async (parent, { credentials }, context) => {
    const user = await context.models.mongo.User.getByEmail(
      credentials.email,
      context,
    );
    if (!user) {
      return new Error('No user with that email');
    }

    const valid = await bcrypt.compare(credentials.password, user.password);

    if (!valid) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      APP_SECRET,
      { expiresIn: '1d' },
    );

    return { user, token };
  },
  addAuthor: (parent, { author }, context) => {
    if (!context.user || context.user.role !== 'ADMIN') return notAuthorized();
    return context.models.mongo.Author.addAuthor(author, context).then(
      newAuthor => {
        pubsub.publish(AUTHOR_CREATED, { authorCreated: newAuthor });
        return newAuthor;
      },
    );
  },
  updateAuthor: (parent, { author }, context) => {
    if (!context.user || context.user.role !== 'ADMIN') return notAuthorized();
    return context.models.mongo.Author.updateAuthor(author, context).then(
      updatedAuthor => {
        pubsub.publish(AUTHOR_UPDATED, { authorUpdated: updatedAuthor });
        return updatedAuthor;
      },
    );
  },
};
