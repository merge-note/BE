import app from "./app";
import pool from "./config/db";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

pool
  .getConnection()
  .then(() => console.log("Connected to DB!"))
  .catch((err: any) => console.error(`Error connecting to DB: ${err}`));
