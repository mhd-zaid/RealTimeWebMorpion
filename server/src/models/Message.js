import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Message extends Model {
    static associate(db) {
      Message.belongsTo(db.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Message.belongsTo(db.Room, {
        foreignKey: 'roomId',
        as: 'room',
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
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'Message',
    }
  );

  return Message;
}
