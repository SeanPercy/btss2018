import BaseMongoModel from './BaseMongoModel';

export default class Book extends BaseMongoModel {
	addMessage({book}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection).insert({book});
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