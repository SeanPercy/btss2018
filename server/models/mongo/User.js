import BaseMongoModel from './BaseMongoModel';

export default class User extends BaseMongoModel {
	getByEmail(email, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.findOne({ email });
	}
	create({username, email, password, role}, context){
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.insert({ username, email, password, role})
			.then((response) => response.ops[0]);
	}
}