export default (io, db) => {
  io.of('/messages').on('connection', async socket => {
    socket.join('global-chat');
    socket.on('disconnect', () => {
      socket.leave('global-chat');
    });
    const broadcastMessages = async () => {
      socket.to('global-chat').emit('messages:list', {
        status: 'success',
        data: await db.Message.findAll(
        {
          where: {
            partyId: null,
          },
          include: { model: db.User, attributes: ['id', 'userName'], as: 'user'},
        }
      ),
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

    socket.emit('messages:create:party', async data => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        partyId: data.partyId,
      });
      return { status: 'success', message: 'messages created' };
    });

    socket.emit('messages:list:party', async data => {
      await db.Message.findAll({
        where: {
          partyId: data.partyId,
        },
      });
      return { status: 'success', data: messages };
    });
  });

  return io;
};
