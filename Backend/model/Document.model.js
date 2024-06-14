import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import User from "../model/user.model.js"; // Import the User model
import Notaries from "../model/notary.model.js"; // Import the Notary model

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
      type: DataTypes.STRING, // Changed to STRING to match cnic type in Notaries
      allowNull: true,
      references: {
        model: Notaries,
        key: "cnic",
      },
    },
    documentFile: {
      type: DataTypes.STRING, // Store file path
      allowNull: true,
    },
    documentFileUpdated: {
      type: DataTypes.STRING, // Store file updated path
      allowNull: true,
    },
    documentdata: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    updatedDocumnetData: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    DocumentSignedData: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    documentSignedUpdated: {
      type: DataTypes.STRING, // Store signed file updated path
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
    synchoronizeFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Document",
  }
);

// Define the relationship between Document and User
Document.belongsTo(User, { foreignKey: "UserId" });

// If the database does not exist, create it
Document.sync();

export default Document;
