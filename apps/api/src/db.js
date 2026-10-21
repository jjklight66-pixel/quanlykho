import 'dotenv/config';
import pg from 'pg';
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgres://wms:wms_dev_password@localhost:5432/wms' });
export async function withTx(fn) { const c=await pool.connect(); try { await c.query('BEGIN ISOLATION LEVEL READ COMMITTED'); const v=await fn(c); await c.query('COMMIT'); return v; } catch(e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); } }
