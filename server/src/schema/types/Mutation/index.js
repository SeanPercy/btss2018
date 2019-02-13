import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {pubsub, AUTHOR_CREATED, MESSAGE_CREATED, BOOK_CREATED, APP_SECRET} from '../utils';

export const Mutation =`
    type Mutation {
        addMessage(message: MessageInput!): Message
        deleteAllMessages: Boolean
        login(credentials: UserLoginInput): AuthPayload
        signup(credentials: UserSignUpInput): AuthPayload
        addAuthor(author: AuthorInput!): Author
    }
`;

export const mutationResolvers = {
	signup: async(parent, { credentials }, context) => {
		const { username, email, password, role } = credentials;
		const user = await context.models.mongo.User.create({
			username,
			email,
			password: await bcrypt.hash(password, 10),
			role,
		}, context);
		
		const token = jwt.sign(
			{
				username: user.username,
				email: user.email,
				role: user.role
			},
			APP_SECRET,
			{ expiresIn: '1y' }
		);
		
		return { user, token };
	},
	login: async(parent, { credentials }, context) => {
		const user = await context.models.mongo.User.getByEmail(credentials.email, context);
		if (!user) {
			throw new Error('No user with that email');
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
				role: user.role
			},
			APP_SECRET,
			{ expiresIn: '1d' }
		);
		
		return { user, token };
	},
	addMessage: (parent, { message }, context) => {
		pubsub.publish(MESSAGE_CREATED, { messageCreated: message });
		return context.models.mongo.Message.addMessage(message, context);
	},
	addAuthor: (parent, { author }, context) => {
		pubsub.publish(AUTHOR_CREATED, { authorCreated: author });
		return context.models.mongo.Author.addAuthor(author, context);
	},
	/*
	addBook: (parent, { book }, context) => {
		pubsub.publish(BOOK_CREATED, { bookCreated: book });
		return context.models.mongo.Book.addBook(book, context);
	},*/
	deleteAllMessages: (parent, _, context) => {
		return context.models.mongo.Message.deleteAll(context);
	}
};
