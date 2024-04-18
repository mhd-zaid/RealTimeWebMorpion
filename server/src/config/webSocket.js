import db from "../models/index.js";
import messageSocket from "../routes/sockets/message.js";

export default (io) => {
  messageSocket(io, db);
  
};