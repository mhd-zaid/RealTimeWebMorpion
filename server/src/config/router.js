import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/user.js';
import roomRoutes from '../routes/room.js';
import messageRoutes from '../routes/message.js';
export default (app, express) => {
  app.use('/api', authRoutes(express.Router()));
  app.use('/api/users', userRoutes(express.Router()));
  app.use('/api/rooms', roomRoutes(express.Router()));
  app.use('/api/messages', messageRoutes(express.Router()));
};
