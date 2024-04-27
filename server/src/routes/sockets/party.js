import { uuidv7 } from 'uuidv7';

export default (io, db) => {
  io.of("/parties").on("connection", socket => {
    socket.on("server:parties:list:all", async () => {
      const parties = await db.Party.findAll();
      socket.emit("client:parties:list:all", { status: "success", data: parties });
    });

    socket.on("server:parties:create", async (data) => {
      try{
        const id = uuidv7();
        if(data.is_private && !data.code) {
          throw new Error('Le code de la partie est requis.');
        }
        const party = await db.Party.create({ id, ...data });
        socket.emit("client:parties:create:party", { status: "success", data: party });
      }
      catch (error) {
        socket.emit("client:parties:join:party", { status: "error", message: error.message });
      }
    });

    socket.on("server:parties:join:party", async (data) => {
      try {
        const party = await db.Party.findByPk(data.id);
        if (!party) {
          throw new Error('La partie n\'existe pas.');
        }
        if (party.user1Id === data.user2Id) {
          throw new Error('Vous ne pouvez pas rejoindre votre propre partie.');
        }
        if(party.is_private && party.code !== data.code) {
          throw new Error('Le code de la partie est incorrect.');
        }
        if (party.status !== 'searchPlayer') {
          throw new Error('La partie est déjà en cours.');
        }

        const symbolUser1 = Math.random() < 0.5 ? 'X' : 'O';
        const symbolUser2 = symbolUser1 === 'X' ? 'O' : 'X';

        const partyJoined = await db.Party.update({
          user2Id: data.user2Id,
          status: "in progress",
          symbolUser1: symbolUser1,
          symbolUser2: symbolUser2
        }, {
          where: {
            id: data.id,
            status: "searchPlayer"
          },
          returning: true
        });

        if (partyJoined[0] === 0) {
          throw new Error('La partie a déjà été rejointe par un autre joueur.');
        }

        socket.emit("client:parties:join:party", { status: "success", message: partyJoined });
      } catch (error) {
        socket.emit("client:parties:join:party", { status: "error", message: error.message });
      }
    });

  });

  return io;
};
