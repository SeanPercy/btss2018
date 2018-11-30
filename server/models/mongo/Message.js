import BaseMongoModel from './BaseMongoModel';

export default class Message extends BaseMongoModel {
	addMessage({content, info}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insertOne({content, info})
			.then((respsone) => respsone.ops[0]);
	}
	search(where, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find(where);
	}
}