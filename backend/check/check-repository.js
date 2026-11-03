import 'dotenv/config';
import pg from 'pg';
import { PgRegistrationRepository } from '../src/repository.js';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

const repository = new PgRegistrationRepository(pool);

try {
    const events = await repository.listEvents();

    console.log('Events:', events);

    const event = await repository.getEvent('E001');

    console.log('Selected event:', event);
} finally {
    await pool.end();
}

// Test repository transactions
const registration = await repository.transaction(
    async (tx) => {
        const event = await tx.lockEvent('E001');

        if (!event) {
            throw new Error('Event not found');
        }

        return tx.create('S001', 'E001');
    }
);

// use to verify ROLLBACK
await repository.transaction(async (tx) => {
    await tx.create('S001', 'E003');

    throw new Error('Simulated failure');
});

console.log(registration);