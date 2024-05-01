import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";

class Days extends Model {}

Days.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Days",
  }
);

// If the database table doesn't exist, Sequelize will create it
Days.sync({
  force: true,
});

export default Days;
