export default (io, db) => {
  io.of('/messages').on('connection', async socket => {
    const broadcastMessages = async () => {
      io.of('/messages').emit('messages:list', {
        status: 'success',
        data: await db.Message.findAll(),
      });
    };

    broadcastMessages();

    socket.on('messages:create', async data => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
      });
      broadcastMessages();
    });

    socket.emit('messages:create:room', async data => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      });
      return { status: 'success', message: 'messages created' };
    });

    socket.emit('messages:list:room', async data => {
      await db.Message.findAll({
        where: {
          roomId: data.roomId,
        },
      });
      return { status: 'success', data: messages };
    });
  });

  return io;
};
