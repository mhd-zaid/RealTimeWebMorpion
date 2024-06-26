import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/user.js';
import messageRoutes from '../routes/message.js';
import partyRoutes from '../routes/party.js';
import verifyUser from '../middlewares/verifyUser.js';
export default (app, express) => {
  app.use('/api', authRoutes(express.Router()));
  app.use('/api/users', userRoutes(express.Router()));
  app.use('/api/messages', messageRoutes(express.Router()));
  app.use('/api/parties', verifyUser,partyRoutes(express.Router()));
};
