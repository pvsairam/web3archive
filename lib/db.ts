import { Pool } from 'pg';

// Use external PostgreSQL database
// SSL is disabled for VPS without SSL certificates
// For production, configure SSL on your VPS and set ssl: { rejectUnauthorized: false }
const pool = new Pool({
  connectionString: process.env.EXTERNAL_DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export default pool;

// Helper function to test connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return { success: true, time: result.rows[0].now };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
