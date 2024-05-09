import { uuidv7 } from 'uuidv7';
import checkAuthSocket from '../../middlewares/checkAuthSocket.js';
import {Op} from "sequelize";
export default (io, db) => {

  function generateRandomSixDigit() {
    const random = Math.random() * 1000000;
    const paddedString = random.toFixed(0).padStart(6, '0');
    return paddedString.slice(-6);
  }

  function generateUniqueSixDigit(excludedNumbers) {
    let unique = false;
    let random;

    while (!unique) {
      random = generateRandomSixDigit();
      unique = !excludedNumbers.includes(random);
    }

    return random;
  }

  io.of("/parties")
    .use( async(socket, next) => {
      const checkUser = await checkAuthSocket(socket, db);
      if(checkUser === false) {
        return next(new Error("Vous devez être connecté"));
      }
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
          status: "finished",
          [Op.or]: [
            { user1Id: socket.userId },
            { user2Id: socket.userId },
          ],
        }
      });

      const broadcastPartiesInProgress = async () => {
        const data = await db.Party.findAll({
          include: [
            {
              model: db.User,
              as: 'user1',
              attributes: ['id', 'userName']
            },
          ],
          where: {
            status: "searchPlayer",
            is_private: false
          }
        });
        io.of("/parties").emit("server:parties:list:inProgress", {status: "success", data});
      }

      socket.on('join', async room => {
        socket.join(room);
        const data = await db.Party.findByPk(room,{
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
          ]
        });
        socket.to(room).emit("server:parties:start", {status: "success", data});
      })

      socket.emit("server:parties:list:user", { status: "success", data: parties });

      socket.on('client:parties:list:inProgress', async () => {
        await broadcastPartiesInProgress();
      });

      socket.on('client:parties:cancel:party', async () => {
        await db.Party.destroy({
          where: {
            user1Id: socket.userId,
            status: "searchPlayer"
          }
        });
      });

      socket.on('client:parties:create', async ({is_private}, callback) => {
        try {
          const id = uuidv7();
          let partiesInProgress = null
          let code = null

          if(is_private ){
            partiesInProgress = await db.Party.findAll({
              attributes: ['code'],
              where: {
                status: "searchPlayer",
                is_private: is_private
              }
            });
            if(partiesInProgress.dataValues === undefined) {
              code = generateRandomSixDigit();
            }else{
              const excludedCodes = partiesInProgress.map(party => party.code);
              code = generateUniqueSixDigit(excludedCodes);
            }
          }

          const symbolUser1 = Math.random() < 0.5 ? 'X' : 'O';
          const symbolUser2 = symbolUser1 === 'X' ? 'O' : 'X';
          const party = await db.Party.create({ id, user1Id: socket.userId, code, symbolUser1, symbolUser2, is_private });
          await broadcastPartiesInProgress()
          callback({ status: "success", data: party });
        } catch (error) {
          socket.emit('server:parties:create', { status: 'error', message: error.message });
        }
      })

      socket.on("client:parties:join:party", async (data, callback) => {
        try {
          let party

          if(data.code){
            party = await db.Party.findOne({
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
              ],
              where: {
                code: data.code,
                status: "searchPlayer"
              }
            });
          }else{
            party = await db.Party.findOne({
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
              ],
              where: {
                id: data.id,
                status: "searchPlayer"
              }
            });
          }

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

          const partyJoined = await db.Party.update({
            user2Id: socket.userId,
            status: "in progress",
          }, {
            where: {
              id: party.id,
              status: "searchPlayer"
            },
            returning: true,
          });

          const updatedParty = await db.Party.findOne({
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
            ],
            where: {
              id: party.id,
            }
          });

          if (partyJoined[0] === 0) {
            throw new Error('La partie a déjà été rejointe par un autre joueur.');
          }

          callback({ status: "success", data: updatedParty.dataValues });
        } catch (error) {
          socket.emit("client:parties:join:party", { status: "error", message: error.message });
        }
      });

    });

  return io;
};
