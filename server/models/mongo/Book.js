import BaseMongoModel from './BaseMongoModel';

export default class Book extends BaseMongoModel {
	addBook({book}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insertOne({book})
			.then((response) => response.ops[0]);
	}
	getByTitle(title, context){
		if (!context.user) return null;
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.findOne({title});
	}
	search(where, context){
		if (!context.user) return null;
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find(where);
	}
}