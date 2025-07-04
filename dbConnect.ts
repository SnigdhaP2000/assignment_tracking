import { Pool } from "pg";

const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
});

export default pool;
