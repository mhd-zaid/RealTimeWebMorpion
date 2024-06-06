import checkAuthSocket from '../../middlewares/checkAuthSocket.js';

export default (io, db) => {
  io.of('/messages')
    .use(async (socket, next) => {
      const checkUser = await checkAuthSocket(socket, db);
      if (checkUser === false) {
        return next(new Error('Vous devez être connecté'));
      }
      socket.user = checkUser;
      next();
    })
    .on('connection', async socket => {
      socket.on('join', async room => {
        await db.Message.create({
          content: `${socket.user.userName} vient de se connecter`,
          userId: null,
          partyId:
            socket.handshake.query.partyId === 'general'
              ? null
              : socket.handshake.query.partyId,
        });
        socket.join(room);
        broadcastMessages(room);
      });

      socket.on('disconnecting', async () => {
        await db.Message.create({
          content: `${socket.user.userName} vient de se déconnecter`,
          userId: null,
          partyId:
            socket.handshake.query.partyId === 'general'
              ? null
              : socket.handshake.query.partyId,
        });
      });

      const broadcastMessages = async room => {
        io.of('/messages')
          .to(room)
          .emit('messages:list', {
            status: 'success',
            data: await db.Message.findAll({
              where: {
                partyId: room === 'general' ? null : room,
              },
              include: {
                model: db.User,
                attributes: ['id', 'userName'],
                as: 'user',
              },
              order: [['createdAt', 'ASC']],
            }),
          });
      };

      socket.on('messages:create', async ({ content, room }) => {
        await db.Message.create({
          content: content,
          userId: socket.user.id,
          partyId: room === 'general' ? null : room,
        });
        broadcastMessages(room);
      });
    });

  return io;
};
