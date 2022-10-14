import { Pool } from "pg";

void (async (): Promise<void> => {
  process.stdout.write('I am the events publisher.\n');
  const pool = new Pool();

  const queryText = 'SELECT * FROM outbox ORDER BY date LIMIT 1';
  const res = await pool.query(queryText);
  if (res.rowCount > 0) {
    const event = res.rows[0];
    console.log('Publishing event', event);
    await pool.query('DELETE FROM outbox WHERE id = $1', [event.id]);
  }

  await new Promise((resolve) => { setTimeout(resolve, 60 * 60 * 1000); });
})();
