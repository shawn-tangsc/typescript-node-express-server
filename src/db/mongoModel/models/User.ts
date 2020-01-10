import bcrypt from 'bcrypt';
import {Document, Schema} from 'mongoose';
import { BaseModel } from '../BaseModel';
interface IUser extends Document {
    userName: string;
    password: string;
    roles: string;
  }

const schema = new Schema({
    userName: { type: String, require: true , unique: true},
    password: { type: String, require: true },
    roles: {type: Array, require: true},
}, {collection: 'user', id: true});

class UserModel extends BaseModel<IUser> {
  public async comparePassword(passw: string, localPassword: string) {
    return bcrypt.compare(passw, localPassword);
  }
}
const User = new UserModel('User', schema);
export {IUser, User};
