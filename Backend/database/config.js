import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  "NotaryNow",
  "postgres",
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
