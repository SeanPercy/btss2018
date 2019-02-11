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

// below are the fallback default values, when running the app on Docker. When not using Docker the 'host' values have to be changed
export default {
	auth: {
		password: APP_PASSWORD || 'app-password',
		user: APP_USER || 'app-user'
	},
	authMechanism: AUTH_MECHANISM || 'DEFAULT',
	db: {
		host: DB_HOST || 'mongodb://mongo', //  Change it to 'mongodb://localhost' when not using Docker. 'mongo' refers to the Docker container's name inside docker-compose.*.yml
		name: DATABASE || 'btss2018',
		port: DB_PORT || '27017',
	},
	jwt: {
		secret: APP_SECRET || 'my_secret',
	},
	server: {
		host: SERVER_HOST || '192.168.99.100',  // Change it to "localhost" when not using Docker
		path: SERVER_PATH || '/graphql/',
		port: SERVER_PORT || 4000,
	}
};