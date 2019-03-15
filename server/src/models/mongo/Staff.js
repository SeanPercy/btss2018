import BaseMongoModel from './BaseMongoModel';

export default class Staff extends BaseMongoModel {
  getByName(name, context) {
    if (!context.user) return null;
    return context.connectors[this.connectorKeys.db]
      .collection(this.connectorKeys.collection)
      .find({ $or: [{ firstName: name }, { lastName: name }] });
  }
}
