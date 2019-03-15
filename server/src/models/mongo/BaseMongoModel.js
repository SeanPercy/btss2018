import { ObjectID } from 'mongodb';

export default class BaseMongoModel {
  constructor(connectorKeys) {
    this.connectorKeys = connectorKeys;
  }

  deleteAll(context) {
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .drop();
  }

  deleteById(id, context) {
    const _id = ObjectID(id);
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .remove({ _id });
  }

  getAll(context) {
    if (!context.user || !context.user.role === 'ADMIN')
      return new Error('Not Authorizied');
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .find({})
      .toArray();
  }

  getById(id, context) {
    const _id = ObjectID(id);
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .findOne({ _id });
  }

  getByIds(ids, context) {
    const _ids = ids.map(id => ObjectID(id));
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .find({ _id: { $in: _ids } })
      .toArray();
  }
}
