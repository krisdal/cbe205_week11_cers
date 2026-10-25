export class PgRegistrationRepository {
  constructor(pool) {
    this.pool = pool;
  }
  async listEvents() {
    const { rows } = await this.pool.query(
      `SELECT e.*, (SELECT COUNT(*)::int FROM registrations r WHERE r.event_id=e.event_id AND r.status='CONFIRMED') AS registered FROM events e ORDER BY start_at`,
    );
    return rows;
  }
  async getEvent(id) {
    const { rows } = await this.pool.query(
      "SELECT * FROM events WHERE event_id=$1",
      [id],
    );
    return rows[0] ?? null;
  }
  async transaction(fn) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const tx = {
        lockEvent: async (id) =>
          (
            await client.query(
              "SELECT * FROM events WHERE event_id=$1 FOR UPDATE",
              [id],
            )
          ).rows[0] ?? null,
        exists: async (studentId, eventId) =>
          (
            await client.query(
              "SELECT 1 FROM registrations WHERE student_id=$1 AND event_id=$2",
              [studentId, eventId],
            )
          ).rowCount > 0,
        countConfirmed: async (eventId) =>
          Number(
            (
              await client.query(
                "SELECT COUNT(*) AS n FROM registrations WHERE event_id=$1 AND status='CONFIRMED'",
                [eventId],
              )
            ).rows[0].n,
          ),
        create: async (studentId, eventId) =>
          (
            await client.query(
              "INSERT INTO registrations(student_id,event_id,status) VALUES($1,$2,'CONFIRMED') RETURNING *",
              [studentId, eventId],
            )
          ).rows[0],
      };
      const result = await fn(tx);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
