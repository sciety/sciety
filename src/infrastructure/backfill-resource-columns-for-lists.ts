/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pool } from 'pg';
import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';
import { Logger } from '../shared-ports';

export const backfillResourceColumnsForLists = (
  pool: Pool, logger: Logger,
) => (events: Array<DomainEvent>) => T.of(undefined);
