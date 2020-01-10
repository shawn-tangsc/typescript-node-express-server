/**
 * 这个装饰器修饰的类都会被注册成路由
 * @param prefix 路由的一级路径
 */
export const CController = (prefix: string) => {
  return (target: any) => {
    if (prefix.charAt(0) !== '/') {
      prefix = `/${prefix}`;
    }
    Reflect.defineMetadata('prefix', prefix, target);
    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
};
