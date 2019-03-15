import jwt from 'jsonwebtoken';
import { serverConfig } from '../server-config';

const {
  jwt: { secret: APP_SECRET },
} = serverConfig;

const getUser = authorization => {
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { _id, username, email, role } = jwt.verify(token, APP_SECRET);
    return { _id, username, email, role };
  }
  return undefined;
};

export { APP_SECRET, getUser };
