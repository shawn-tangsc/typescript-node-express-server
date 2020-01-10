'use strict';
import {Document, ModelUpdateOptions, QueryFindOneAndUpdateOptions, Schema} from 'mongoose';
import * as mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * 默认schema，五大字段
 */
const defaultSchema = new Schema({
    createTime: {type: String},
    createBy: {type: String, default: 'System'},
    updateTime: {type: String},
    updateBy: {type: String, default: 'System'},
    isDeleted: {type: Boolean , default: 0},
});
/**
 * Module dependencies.
 */
class BaseModel<T extends Document> {
  private _model: any;

  constructor(collection: string, schema: Schema) {
    if (!collection) {
      throw new Error('必须指定 collection name ');
    }
    schema.add(defaultSchema);
    this._model = mongoose.model<T>(collection, schema);
  }

  public create(user: Object): T {
    return this._model.create(user);
  }

  public findById(id: string): T {
    return this._model.findById(id).exec();
  }

  public findOne(query: Object): T {
    return this._model.findOne(query).exec();
  }

  public update(query: Object, doc: Object, options?: ModelUpdateOptions): {ok: number, nModified: number, n: number} {
    return this._model.update(query, doc, options).exec();
  }

  public findOneAndUpdate(query: Object, doc: Object, options?: QueryFindOneAndUpdateOptions): T {
    return this._model.findOneAndUpdate(query, doc, options).exec();
  }

  public remove(conditions: Object): {result: Object} {
    return this._model.remove(conditions).exec();
  }
}
export {BaseModel, ObjectId};
