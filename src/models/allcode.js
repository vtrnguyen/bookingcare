'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcodes.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' });
      Allcodes.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
    }
  };
  Allcodes.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcodes',
  });
  return Allcodes;
};