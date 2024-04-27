import MorpionService from '../../services/morpionService.js';
export default (io,db) => {
    io.of("/morpion").on("connection",socket => {
      socket.on("server:morpion:mooveplay:create", async (data) => {
        try {
          const { partyId, moveUserId, numerousLine, numerousColumn, symbol } = data;
          const morpionService = new MorpionService(db);
          const moovePlayed =  await morpionService.playMove(partyId, moveUserId, numerousLine, numerousColumn, symbol);
          console.log("MOOVEPLAYED", moovePlayed)
          socket.emit("client:morpion:mooveplay:create", { status: "success", data: moovePlayed });
        } catch (error) {
          socket.emit("client:morpion:mooveplay:create", { status: "error", message: error.message });
        }
      });
      
    });
  
    return io;
};
  