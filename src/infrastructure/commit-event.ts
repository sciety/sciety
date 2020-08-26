import { Pool } from 'pg';
import { Logger } from './logger';
import { DomainEvent } from '../types/domain-events';

type CommitEvent = (event: DomainEvent) => Promise<void>;

export default (
  events: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvent => (
  async (event) => {
    try {
      await pool.query('CREATE TABLE IF NOT EXISTS events (type varchar);');
      const insertionResult = await pool.query('INSERT INTO events (type) VALUES ($1) RETURNING *;', [event.type]);
      logger('debug', 'Insertion result', { result: insertionResult.rows });
    } catch (error) {
      logger('debug', 'Could not connect to the database', { error });
    }
    events.push(event);
  }
);
