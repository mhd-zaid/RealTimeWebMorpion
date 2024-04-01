import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class MoovePlay extends Model {
    static associate(db) {
        MoovePlay.belongsTo(db.Party, {
            foreignKey: 'partyId',
            as: 'party',
        });
        MoovePlay.belongsTo(db.User, {
            foreignKey: 'moveUserId',
            as: 'moveUser',
        });
    }
  }

  MoovePlay.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      numerousLine: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      numerousColumn: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      symbol: {
        type: DataTypes.ENUM('X', 'O'),
        allowNull: true,
      },
      mooveNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      sequelize: connection,
      tableName: 'MoovePlay',
    },
  );

  return MoovePlay;
}
