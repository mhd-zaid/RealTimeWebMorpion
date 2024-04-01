import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Party extends Model {
    static associate(db) {
        Party.belongsTo(db.User, {
            foreignKey: 'user1Id',
            as: 'user1',
        });
        Party.belongsTo(db.User, {
            foreignKey: 'user2Id',
            as: 'user2',
        });
        Party.belongsTo(db.User, {
            allowNull: true,
            foreignKey: 'winnerId',
            as: 'winner',
        });
        Party.belongsTo(db.Room, {
            foreignKey: 'roomId',
            as: 'room',
        });
    }
  }

  Party.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      status: {
        type: DataTypes.ENUM('in progress', 'finished'),
        defaultValue: 'in progress',
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: 'Party',
    },
  );

  return Party;
}
