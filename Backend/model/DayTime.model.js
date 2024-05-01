import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
class DayTime extends Model {}

DayTime.init(
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
    modelName: "DayTime",
  }
);

// If the database table doesn't exist, Sequelize will create it
DayTime.sync({
  force: true,
});

export default DayTime;
