import jwt from "jsonwebtoken"

export default () => ({
    createToken: (user) => {
        const token = jwt.sign(
            {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );

        return Buffer.from(token).toString("base64");
    },

    verifyToken: (token) => {
        try {
            const decodedToken = Buffer.from(token, 'base64').toString('ascii');
            return jwt.verify(decodedToken, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return null;
        }
    }
})