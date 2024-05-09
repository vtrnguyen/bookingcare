'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialties extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialties.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'specialtyTypeData' })
    }
  };
  Specialties.init({
    nameVi: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkDown: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Specialties',
  });
  return Specialties;
};