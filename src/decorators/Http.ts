/**
 * get post put delete 请求类型的装饰器
 */
import { IRouteDefinition } from '@/types/types';

/**
 * 生成'get' | 'post' | 'delete' | 'options' | 'put' 装饰器的工厂方法
 * @param method 只接受'get' | 'post' | 'delete' | 'options' | 'put'
 */
const createMappingDecorator = (method: 'get' | 'post' | 'delete' | 'options' | 'put') => (path: string): MethodDecorator => {
  if (path.charAt(0) !== '/') {
    path = `/${path}`;
  }
  return (target, propertyKey, descriptor) => {
    if (!Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }
    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes: IRouteDefinition[] = Reflect.getMetadata('routes', target.constructor);

    routes.push({
      requestMethod: method,
      path,
      target,
      methodName: propertyKey,
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};

export const Get = createMappingDecorator('get');
export const Post = createMappingDecorator('post');
export const Put = createMappingDecorator('put');
export const Delete = createMappingDecorator('delete');
