import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
class DayTimes extends Model {}

DayTimes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Days",
        key: "id",
      },
    },
    time_slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "TimeSlots",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "DayTimes",
  }
);

// If the database table doesn't exist, Sequelize will create it
DayTimes.sync();

export default DayTimes;
