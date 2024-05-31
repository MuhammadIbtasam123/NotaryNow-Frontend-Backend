import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import NotaryAvailability from "./notaryAvailability.model.js"; // Assuming the correct path to the model
import User from "./user.model.js"; // Assuming the correct path to the model
import Document from "./Document.model.js"; // Assuming the correct path to the model

class Appointment extends Model {}

Appointment.init(
  {
    appointmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notaryAvailabilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: NotaryAvailability, // Reference to the NotaryAvailability model
        key: "id",
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User, // Reference to the User model
        key: "cnic",
      },
    },
    docId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Document, // Reference to the Document model
        key: "documentId",
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeSlot: {
      type: DataTypes.STRING, // Assuming the time slot is stored as a string
      allowNull: false,
    },
    notaryConfirmationStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    clinetPaymentStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    paidReceipt: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
  }
);

// Define associations
Appointment.belongsTo(NotaryAvailability, {
  foreignKey: "notaryAvailabilityId",
});
Appointment.belongsTo(User, { foreignKey: "userId" });

// If the database table doesn't exist, Sequelize will create it
Appointment.sync();

export default Appointment;
