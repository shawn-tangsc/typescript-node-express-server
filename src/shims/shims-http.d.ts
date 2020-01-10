declare module 'http' {
  // tslint:disable-next-line:interface-name
  interface IncomingHttpHeaders {
    'x-http-method-override'?: string;
  }
}
