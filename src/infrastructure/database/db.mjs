import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

console.log('DB_USER:', process.env.DB_ADMIN);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD_ADMIN);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD_ADMIN,
  database: process.env.DB_NAME,
});

(async() => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
})();

export default pool;
