export default (io,db) => {
  io.of("/messages").on("connection",socket => {
    socket.emit("messages:list", async () => { return { status: "success", data: await db.Message.findAll()}});

    socket.emit("messages:create", async () => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        roomId: null,
      });
      return {status: "success", message: "messages created"}
    });

    socket.emit("messages:create:room", async (data) => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      });
      return {status: "success", message: "messages created"}
    });
    
    socket.emit("messages:list:room", async (data) => {
      await db.Message.findAll({
        where: {
          roomId: data.roomId,
        }
      });
      return {status: "success", data: messages}
    });
    
  });

  return io;
};
