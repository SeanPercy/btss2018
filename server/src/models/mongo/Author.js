import BaseMongoModel from './BaseMongoModel';

export default class Author extends BaseMongoModel {
	addAuthor(author, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insertOne(author)
			.then((response) => response.ops[0]);
	}
	getByName(name, context){
		if (!context.user) return null;
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find({ $or : [{firstName: name}, {lastName: name} ]});
	}
}