import { ObjectID } from 'mongodb';

export default class BaseMongoModel {
	constructor(connectorKeys){
		this.connectorKeys = connectorKeys;
	}
	deleteAll(context){
		if (!context.user || !context.user.role === 'ADMIN') return null;
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.drop();
	}
	deleteById(id, context){
		if (!context.user || !context.user.role === 'ADMIN') return null;
		const _id = ObjectID(id);
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.remove({ _id });
	}
	getAll(context) {
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find({}).toArray();
	}
	getById(id, context){
		//if (!context.user) return null;
		const _id = ObjectID(id);
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.findOne({ _id });
	}
	getByIds(ids, context){
		//if (!context.user) return null;
		const _ids = ids.map(id => ObjectID(id));
		return context.connectors[this.connectorKeys.db]
			.collection(this.connectorKeys.collection)
			.find({ '_id': { $in: _ids } }).toArray();
	}
}