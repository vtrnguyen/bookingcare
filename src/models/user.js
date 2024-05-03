'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Allcodes, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
      User.belongsTo(models.Allcodes, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
      // the foreign key below is belongs to table Markdowns
      User.hasOne(models.Markdowns, { foreignKey: 'doctorId' });
      User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' });
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};