import jwt from 'jsonwebtoken';
import { serverConfig } from '../server-config';

const { jwt: { secret: APP_SECRET } } = serverConfig;

const getUser = (token) => {
	const Authorization = token;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { _id, username, email, role } = jwt.verify(token, APP_SECRET);
		return { _id, username, email, role };
	}
};

export { APP_SECRET, getUser };
