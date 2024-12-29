'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.password;
      delete attributes.resetToken;
      delete attributes.resetTokenExpiry;
      return attributes;
    }

  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('0', '1', '2', '3'),
    avtar: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    resetToken: DataTypes.STRING,
    resetTokenExpiry: DataTypes.STRING,
    verifiedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};