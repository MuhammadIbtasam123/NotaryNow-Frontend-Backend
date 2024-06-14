import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";

class Notaries extends Model {}

Notaries.init(
  {
    notary_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
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
    },
    Seal_Issue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Expiry_data: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalDocNotarized: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Notaries",
  }
);

Notaries.sync();

export default Notaries;
