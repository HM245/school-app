import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (global.__mysqlPool) return global.__mysqlPool;

  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "schools",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  global.__mysqlPool = pool;
  return pool;
}

export default getPool;
