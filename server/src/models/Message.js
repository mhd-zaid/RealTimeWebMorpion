import { Model, DataTypes, where } from 'sequelize';

export default function (connection) {
  class Message extends Model {
    static associate(db) {
      Message.belongsTo(db.User, {
        foreignKey: 'userId',
        allowNull: true,
        as: 'user',
      });
      Message.belongsTo(db.Party, {
        foreignKey: 'partyId',
        as: 'party',
      });

      Message.addHook('beforeCreate', async () => {
        const messages = await db.Message.findAll({
          where: {
            partyId: null,
            userId: null,
          },
          order: [['createdAt', 'ASC']],
        });
        if (messages.length > 50) {
          const messagesToDelete = messages.slice(0, 25);
          messagesToDelete.forEach(async message => {
            await db.Message.destroy({ where: { id: message.id } });
          });
        }
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'Message',
    },
  );

  return Message;
}
