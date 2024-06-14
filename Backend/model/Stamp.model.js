import { Model, DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import Notaries from "../model/notary.model.js"; // Import the Notary model

class Stamp extends Model {}

Stamp.init(
  {
    stampId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stampImage: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    notaryId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Notaries,
        key: "cnic",
      },
    },
  },
  {
    sequelize,
    modelName: "Stamp",
    tableName: "stamps",
    timestamps: false,
  }
);

// Define the relationship between Stamp and Notaries
Stamp.belongsTo(Notaries, {
  foreignKey: "notaryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Stamp;
