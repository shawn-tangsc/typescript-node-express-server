/**
 * 是否需要jwt校验的装饰器
 */
export const Auth = (): MethodDecorator => {
  return (target, propertyKey, descriptor) => {

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    // const routes = Reflect.getMetadata('routes', target.constructor) as IRouteDefinition[];
    Reflect.defineMetadata('auth', true, target, propertyKey);
  };
};
