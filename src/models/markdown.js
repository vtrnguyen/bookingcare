'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdowns extends Model {
    static associate(models) {
      Markdowns.belongsTo(models.User, { foreignKey: 'doctorId' });
    }
  };
  Markdowns.init({
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Markdowns',
  });
  return Markdowns;
};