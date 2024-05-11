import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import Notaries from "./notary.model.js";
import DayTimes from "./dayTime.model.js";
class NotaryAvailability extends Model {}

NotaryAvailability.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notaryId: {
      type: DataTypes.STRING, // Assuming the data type of notaryId matches with the primary key of Notary
      allowNull: false,
      references: {
        model: "Notaries",
        key: "cnic", // Assuming "cnic" is the primary key of the Notary table
      },
    },
    dayTimeId: {
      type: DataTypes.INTEGER, // Assuming the data type of dayTimeId matches with the primary key of DayTime
      allowNull: false,
      references: {
        model: "DayTimes",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "NotaryAvailability",
  }
);

// If the database table doesn't exist, Sequelize will create it
NotaryAvailability.sync();

export default NotaryAvailability;
