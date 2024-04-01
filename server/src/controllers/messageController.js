export default (db) => ({
    getRoomMessages: async (req, res) => {
        const id = req.params.id;
        const messages = await db.Message.findAll({
            where: { roomId: id },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'userName'],
                },
            ],
        });
        res.status(200).json(messages);
    },
});