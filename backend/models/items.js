'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      items.belongsTo(models.users, {
        foreignKey: "user_id",
        targetKey: "id"
      })
    }
  };
  items.init({
    name: DataTypes.STRING,
    place: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'items',
    underscored: true,
  });
  return items;
};