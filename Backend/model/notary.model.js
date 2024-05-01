import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";

class Notary extends Model {}

Notary.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    }, 
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnic: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    },
    Nofification_No: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    },
    Seal_Issue: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    },
    Expiry_data: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null, 
    },
    license: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null, 
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null, 
    },
  },
  {
    sequelize,
    modelName: "Notary",
  }
);

// if database is not there
Notary.sync();

export default Notary;
