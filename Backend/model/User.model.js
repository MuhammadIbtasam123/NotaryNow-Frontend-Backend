import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../database/config.js";

class User extends Model {
  async hashSensitiveFields(fields) {
    const saltRounds = 10;
    for (const field of fields) {
      if (this.changed(field)) {
        this[field] = await bcrypt.hash(this[field], saltRounds);
      }
    }
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user) => {
        await user.hashSensitiveFields(["password", "cnic", "email", "name"]);
      },
      beforeUpdate: async (user) => {
        await user.hashSensitiveFields(["password", "cnic", "email", "name"]);
      },
    },
  }
);

// if db not exsited
User.sync();

export default User;
