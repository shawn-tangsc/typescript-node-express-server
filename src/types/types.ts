export interface ITest {
  'key': string;
}

export interface IEnvConfig {
  mongodbURL: string;
  nodeUrl: string;
  secret: string;
}

export interface IHttpError {
  status?: number;
  message?: string;
  stack?: string;
}

export interface IDecoded {
  username?: string;
  exp: number;
  iat: number;
}

export interface IRouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put';
  // Method name within our class responsible for this route
  methodName: string | symbol;
  target: object;
}
