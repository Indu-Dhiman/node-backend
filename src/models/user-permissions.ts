import { DataTypes } from 'sequelize';
import db from '../util/dbConn';

const userPer = db.define('user_permissions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  mainitemId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'main_items',
      key: 'id',
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
});
userPer.sync()

export default userPer;