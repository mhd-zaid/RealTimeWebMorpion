import checkAuthSocket from '../../middlewares/checkAuthSocket.js';

export default io => {
  io.use(async (socket, next) => {
    const checkUser = await checkAuthSocket(socket, db);
    if (checkUser === false) {
      return next(new Error('Vous devez être connecté'));
    }
    const checkAdmin = checkUser.role === 'admin';
    if (checkAdmin === false) {
      return next(new Error('Vous devez être admin'));
    }
    socket.user = checkUser;
    next();
  }).on('connection', async socket => {
    socket.on('send:notification', message => {
      socket.broadcast.emit('notification', message);
    });
  });
  return io;
};
