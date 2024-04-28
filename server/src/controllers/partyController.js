import { Op } from 'sequelize';

export default (db) => ({
    getPartiesUser: async (req, res) => {
        const parties = await db.Party.findAll({
            where: {
                [Op.or]: [
                    { user1Id: req.body.UserId, status: 'finished' },
                    { user2Id: req.body.UserId, status: 'finished' }
                ]
            },
            include: [
                {
                    model: db.User, as: 'user1', attributes: ['id', 'userName'],
                },
                {
                    model: db.User, as: 'user2', attributes: ['id', 'userName'],
                },
            ]
        });
        res.status(200).json(parties);
    },
});