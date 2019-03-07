import BaseMongoModel from './BaseMongoModel';

export default class Book extends BaseMongoModel {
	addBook({book}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insertOne({book})
			.then((response) => response.ops[0]);
	}
	getByTitle(title, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.findOne({title});
	}
	getSample({ skip, limit }, context) {
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find({},{}).skip(skip).limit(limit);
	}
	search(where, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find(where);
	}
}