const {
	DB_HOST,
	DB_PORT,
	SERVER_HOST,
	SERVER_PATH,
	SERVER_PORT,
	DATABASE,
	APP_USER,
	APP_PASSWORD,
	AUTH_MECHANISM,
	APP_SECRET
} = process.env;

export default {
	auth: {
		password: APP_PASSWORD || 'app-password',
		user: APP_USER || 'app-user'
	},
	authMechanism: AUTH_MECHANISM || 'DEFAULT',
	db: {
		host: DB_HOST || 'mongodb://mongo',
		name: DATABASE || 'btss2018',
		port: DB_PORT || '27017',
	},
	jwt: {
		secret: APP_SECRET || 'my_secret',
	},
	server: {
		host: SERVER_HOST || '192.168.99.100',  // THIS DOCKER'S DEFAULT GATEWAY. WHEN NOT USING DOCKER TIS VALUE IS PROBABLY "localhost"
		path: SERVER_PATH || '/graphql/',
		port: SERVER_PORT || 4000,
	}
};