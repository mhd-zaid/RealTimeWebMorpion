import authController from '../controllers/auth.js';
import checkAuth from "../middlewares/checkAuth.js";

export default function (router) {
    const {me, login, register, logout, forgotPassword, resetPassword, verifyEmail, checkToken} = authController();
    router.get('/me', checkAuth(), me);
    router.post('/register', register);
    router.post('/login', login);
    router.post('/logout', logout);
    router.post('/forgotPassword', forgotPassword);
    router.post('/resetPassword/:token', resetPassword);
    router.get('/verify/:token', verifyEmail);
    router.post('/checkToken', checkToken);
    return router;
}