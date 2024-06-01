import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import Appointment from "./Appointment.model.js"; // Assuming the correct path to the model

class Meeting extends Model {}

Meeting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Appointment, // Reference to the Appointment model
        key: "appointmentId",
      },
    },
  },
  {
    sequelize,
    modelName: "Meeting",
  }
);

Meeting.sync();

export default Meeting;
