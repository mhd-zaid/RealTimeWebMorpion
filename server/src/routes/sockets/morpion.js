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

      socket.on('join', async room => {
        socket.join(room);
          console.log("room", room);
        const mooves = await db.MoovePlay.findAll({ where: { partyId: room } });
        const lastMoveUserId = await db.MoovePlay.findOne({ attributes: ["moveUserId"],where: { partyId: room }, order: [['createdAt', 'DESC']] });

        socket.emit("server:morpion:state", {status: "success", data: {mooves, lastMoveUserId: lastMoveUserId?.moveUserId }});
      })

      socket.on("client:morpion:mooveplay:create", async (data, callback) => {
        try {
          const { partyId, numerousLine, numerousColumn, symbol } = data;
          const morpionService = new MorpionService(db);
          const moovePlayed =  await morpionService.playMove(partyId, socket.userId, numerousLine, numerousColumn, symbol);
          const mooves = await db.MoovePlay.findAll({ where: { partyId: partyId } });
          socket.to(partyId).emit("server:morpion:state", {status: "success", data: {mooves, lastMoveUserId: socket.userId, moovePlayed}});
          callback({ status: "success", data: moovePlayed });
        } catch (error) {
          callback({ status: "error", message: error.message });
        }
      });
      
    });
  
    return io;
};
  