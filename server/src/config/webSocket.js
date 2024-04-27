import db from "../models/index.js";
import messageSocket from "../routes/sockets/message.js";
import morpion from "../routes/sockets/morpion.js";
import party from "../routes/sockets/party.js";

export default (io) => {
  // io.use((socket, next) => {
  //   next();
  // });
  messageSocket(io, db);  
  party(io, db);
  morpion(io, db);
};