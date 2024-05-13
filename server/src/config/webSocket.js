import db from '../models/index.js';
import messageSocket from '../routes/sockets/message.js';
import morpion from '../routes/sockets/morpion.js';
import party from '../routes/sockets/party.js';
import checkAuth from '../middlewares/checkAuth.js';
import notification from '../routes/sockets/notification.js';
export default io => {
  notification(io, db);
  messageSocket(io, db);
  party(io, db);
  morpion(io, db);
};
