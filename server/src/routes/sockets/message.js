export default (io, db) => {
  io.of('/messages').on('connection', async socket => {
    socket.on('join', room => {
      socket.join(room);
      broadcastMessages(room);
    });
    socket.on('quit', room => {
      socket.leave(room);
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

    socket.on('messages:create', async ({ content, userId, room }) => {
      await db.Message.create({
        content: content,
        userId: userId,
        partyId: room === 'general' ? null : room,
      });
      broadcastMessages(room);
    });
  });

  return io;
};
