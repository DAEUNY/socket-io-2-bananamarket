const dotenv = require("dotenv");
dotenv.config();

console.log({
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  databaseName: process.env.DATABASE_NAME,
  user_name: process.env.DATABASE_USERNAME,
});