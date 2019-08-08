import socketIo from 'socket.io';

import { onConnection } from './helpers/socket';

export default (app) => {
  const io = socketIo(app);
  const connectionHandler = onConnection(io);

  io.on('connection', connectionHandler);

  return io;
};
