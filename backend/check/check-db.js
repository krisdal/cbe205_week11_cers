import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

try {
    const result = await pool.query(
        'SELECT current_database(), NOW()'
    );

    console.log('Database connected!');
    console.log(result.rows[0]);
} catch (error) {
    console.error('Connection failed:', error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
