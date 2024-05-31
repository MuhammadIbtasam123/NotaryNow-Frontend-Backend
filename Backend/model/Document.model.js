import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import User from "../model/user.model.js"; // Import the User model

class Document extends Model {}

Document.init(
  {
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.STRING, // Adjust the data type if needed
      allowNull: true,
      references: {
        model: User,
        key: "cnic", // Assuming cnic is the primary key of the User table
      },
    },
    notaryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    documentFile: {
      type: DataTypes.STRING, // Store file path or use DataTypes.BLOB if storing in the database
      allowNull: true,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    docStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    signedTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Document",
  }
);

// Define the relationship between Document and User
Document.belongsTo(User, { foreignKey: "UserId" }); // Adjust the foreign key if needed

// If the database does not exist, create it
Document.sync();

export default Document;
