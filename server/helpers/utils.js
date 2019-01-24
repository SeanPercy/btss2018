import jwt from 'jsonwebtoken';
import config from '../../config';

const APP_SECRET = config.jwt.secret;

const getUser = (token) => {
	const Authorization = token;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { _id, username, email, role } = jwt.verify(token, APP_SECRET);
		return { _id, username, email, role };
	}
};

export { APP_SECRET, getUser };
