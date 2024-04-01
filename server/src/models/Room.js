import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Room extends Model {
    static associate(db) {}
  }

  Room.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'Room',
    },
  );

  return Room;
}
