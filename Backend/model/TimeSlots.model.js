import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";

class TimeSlots extends Model {}
TimeSlots.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TimeSlots",
    timestamps: false,
    // schema: "public",
  }
);

// If the database table doesn't exist, Sequelize will create it
TimeSlots.sync();

export default TimeSlots;
