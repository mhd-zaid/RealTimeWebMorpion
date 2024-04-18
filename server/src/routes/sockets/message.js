export default (io,db) => {
  io.of("/messages").on("connection",socket => {
    socket.on("server:messages:list:all", async () => {
      const messages = await db.Message.findAll();
      socket.emit("client:messages:list:all", {status: "success", data: messages});
    });

    socket.on("server:messages:create:all", async (data) => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        roomId: null,
      });
      socket.emit("client:messages:create:all", {status: "success", message: "messages created"});
    });

    socket.on("server:messages:create:room", async (data) => {
      await db.Message.create({
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      });
      socket.emit("client:messages:create:room", {status: "success", message: "messages created in room"});
    });
    
    socket.on("server:messages:list:room", async (data) => {
      const messages = await db.Message.findAll({
        where: {
          roomId: data.roomId,
        }
      });
      socket.emit("client:messages:list:room", {status: "success", data: messages});
    });
  });

  return io;
};
