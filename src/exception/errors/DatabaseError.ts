/**
 * 数据库相关报错
 */
import {BaseError} from './BaseError';

export class DatabaseError extends BaseError {
    constructor(errorString: string) {
        super(errorString, 102, DatabaseError.name);
    }
}
