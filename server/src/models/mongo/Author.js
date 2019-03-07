import { ObjectID } from 'mongodb';

import BaseMongoModel from './BaseMongoModel';

export default class Author extends BaseMongoModel {
	addAuthor(author, context) {
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insertOne(author)
			.then((response) => response.ops[0]);
	}
	getByName(name, context) {
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find({ $or : [{firstName: name}, {lastName: name} ]});
	}
	updateAuthor(author, context) {
		const {_id, books, ...fields} = author;
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.findOneAndUpdate({_id: ObjectID(_id)},{ $set: fields },{returnOriginal: false})
			.then(response => response.value);
	}
}
