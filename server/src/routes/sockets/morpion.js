import MorpionService from '../../services/morpionService.js';
import checkAuthSocket from '../../middlewares/checkAuthSocket.js';

export default (io,db) => {
    io.of("/morpion")
    .use( async(socket, next) => {
      const checkUser = await checkAuthSocket(socket, db);
      if(checkUser === false) {
        return next(new Error("Vous devez être connecté"));
      }
      socket.userId = checkUser.id;
      next();
    }).on("connection",socket => {
      socket.on("server:morpion:mooveplay:create", async (data) => {
        try {
          const { partyId, numerousLine, numerousColumn, symbol } = data;
          const morpionService = new MorpionService(db);
          const moovePlayed =  await morpionService.playMove(partyId, socket.userId, numerousLine, numerousColumn, symbol);
          socket.emit("client:morpion:mooveplay:create", { status: "success", data: moovePlayed });
        } catch (error) {
          socket.emit("client:morpion:mooveplay:create", { status: "error", message: error.message });
        }
      });
      
    });
  
    return io;
};
  