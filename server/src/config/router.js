import authRoutes from '../routes/auth.js';
import userRoutes from '../routes/user.js';
export default (app, express) => {
  app.use('/api', authRoutes(express.Router()));
  app.use('/api/users', userRoutes(express.Router())); 
};
