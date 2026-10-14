import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
  user: process.env.SQL_USER || process.env.PGUSER || 'postgres',
  password: process.env.SQL_PASSWORD || process.env.PGPASSWORD || 'postgres',
  database: process.env.SQL_DB_NAME || process.env.PGDATABASE || 'aether_creations',
  port: Number(process.env.PGPORT || 5432),
  max: 10, // maximum number of concurrent clients
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export default pool;