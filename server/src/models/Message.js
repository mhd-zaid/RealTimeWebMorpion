import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Message extends Model {
    static associate(db) {
      Message.belongsTo(db.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Message.belongsTo(db.Party, {
        foreignKey: 'partyId',
        as: 'party',
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
