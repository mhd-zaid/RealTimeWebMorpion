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
        type: DataTypes.ENUM('searchPlayer', 'in progress', 'finished'),
        defaultValue: 'searchPlayer',
        allowNull: true,
      },
      is_private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      code:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      symbolUser1: {
        type: DataTypes.ENUM('X', 'O'),
        allowNull: true,
      },
      symbolUser2: {
        type: DataTypes.ENUM('X', 'O'),
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
