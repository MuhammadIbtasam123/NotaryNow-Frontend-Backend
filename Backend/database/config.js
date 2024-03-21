import Client from "pg";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  const client = new Client.Client({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    database: "NotaryNow",
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.log("Cannot connect to the database");
  }
};

export default connect;
