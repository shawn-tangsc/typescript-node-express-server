import debug from 'debug';
import http from 'http';
import mongoose from 'mongoose';
import { AddressInfo } from 'net';
import app from './app';
import Logger from './config/log4js';

const DEBUG = debug('bate-node-server:');

const port = process.env.SERVER_PORT;
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => {
  Logger.info(`HTTP Server is running on: port:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

// 我们首先需要拦截 SIGINT信号（由 pm2 stop发出）:
process.on('SIGINT', () => {
  Logger.info('pm2 发出 stop 请求.');
  // 然后，我们要求HTTP服务器停止接收请求并完成正在进行的请求
  server.close((err: any) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }
    // 最后，我们关闭所有资源的连接：
    // close your database connection and exit with success (0 code)
    mongoose.connection.close(() => {
      process.exit(0);
      // rabbitmq.amqpDisConnect();
    });
  });
});

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr: AddressInfo | string | null = server.address();
//   const bind = typeof addr === 'string'
//       ? 'pipe ' + addr
//       : 'port ' + addr.port;
  let bind: string;
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr;
  } else if (typeof (addr as AddressInfo)) {
    bind = 'port ' + addr!.port;
  } else {
    bind = 'null';
  }
  DEBUG('Listening on ' + bind);
}
