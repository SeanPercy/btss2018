import BaseMongoModel from './BaseMongoModel';

export default class Message extends BaseMongoModel {
	addMessage({content, info}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection).insert({content, info});
	}
	search(where, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find(where);
	}
	
}