import { uuidv7 } from 'uuidv7';
import checkAuthSocket from '../../middlewares/checkAuthSocket.js';
import tokenUtils from '../../utils/token.js';
export default (io, db) => {
  io.of("/parties")
    .use( async(socket, next) => {
      const { verifyToken } = tokenUtils();
      // const checkUser = await checkAuthSocket(socket, db);
      // if(checkUser === false) {
      //   return next(new Error("Vous devez être connecté"));
      // }
      const token =  socket.handshake.auth.token;
      const checkUser = await verifyToken(token);
      if (!checkUser) {
        return next(new Error("Vous devez être connecté"));
      }
      socket.userId = checkUser.id;
      next();
    })
    .on("connection", async(socket) => {
      const parties = await db.Party.findAll({
        include: [
          {
            model: db.User,
            as: 'user1',
            attributes: ['id', 'userName']
          },
          {
            model: db.User,
            as: 'user2',
            attributes: ['id', 'userName']
          },
          {
            model: db.User,
            as: 'winner',
            attributes: ['id', 'userName']
          }
        ],
        where: {
          status: "finished"
        }
      });
      const now = new Date();

      console.log("ENVOIE DES PARTIES", now.toISOString(), parties.dataValues);
      socket.emit("client:parties:list:all", { status: "success", data: parties });

      socket.on("server:parties:create", async (data) => {
        try {
          const id = uuidv7();
          if (data.is_private && !data.code) {
            throw new Error('Le code de la partie est requis.');
          }
          const party = await db.Party.create({ id, user1Id: socket.userId, ...data });
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
          if (party.user1Id === socket.userId) {
            throw new Error('Vous ne pouvez pas rejoindre votre propre partie.');
          }
          if (party.is_private && party.code !== data.code) {
            throw new Error('Le code de la partie est incorrect.');
          }
          if (party.status !== 'searchPlayer') {
            throw new Error('La partie est déjà en cours.');
          }

          const symbolUser1 = Math.random() < 0.5 ? 'X' : 'O';
          const symbolUser2 = symbolUser1 === 'X' ? 'O' : 'X';

          const partyJoined = await db.Party.update({
            user2Id: socket.userId,
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
