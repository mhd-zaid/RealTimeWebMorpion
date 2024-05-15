import MorpionService from '../../services/morpionService.js';
import checkAuthSocket from '../../middlewares/checkAuthSocket.js';

export default (io,db) => {
    io.of("/morpion")
    .use( async(socket, next) => {
      const checkUser = await checkAuthSocket(socket, db);
      if(checkUser === false) {
        return next(new Error("Vous devez être connecté"));
      }

      socket.user = checkUser;
      next();
    }).on("connection",socket => {

      socket.on('join', async room => {
        socket.join(room);
        const mooves = await db.MoovePlay.findAll({ where: { partyId: room } });
        const lastMoveUserId = await db.MoovePlay.findOne({ attributes: ["moveUserId"],where: { partyId: room }, order: [['createdAt', 'DESC']] });

        socket.emit("server:morpion:state", {status: "success", data: {mooves, lastMoveUserId: lastMoveUserId?.moveUserId }});
      })

      socket.on('client:parties:morpion:cancel:party', async () => {
        await db.Party.destroy({
          where: {
            user1Id: socket.user.id,
            status: "searchPlayer"
          }
        });
      });

      socket.on("client:morpion:mooveplay:create", async (data, callback) => {
        try {
          const { partyId, numerousLine, numerousColumn, symbol } = data;
          const morpionService = new MorpionService(db);
          const moovePlayed =  await morpionService.playMove(partyId, socket.user.id, numerousLine, numerousColumn, symbol);
          const mooves = await db.MoovePlay.findAll({ where: { partyId: partyId } });
          socket.to(partyId).emit("server:morpion:state", {status: "success", data: {mooves, lastMoveUserId: socket.user.id, moovePlayed}});
          callback({ status: "success", data: moovePlayed });
        } catch (error) {
          callback({ status: "error", message: error.message });
        }
      });
      
    });
  
    return io;
};
  