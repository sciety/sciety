import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { getListsEvents } from './get-lists-events';
import { getListsEventsFromDatabase } from './get-lists-events-from-database';
import { Ports } from './ports';
import {
  jsonSerializer, loggerIO, rTracerLogger, streamLogger,
} from '../infrastructure/logger';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
};

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, Ports> => pipe(
  {
    logger: pipe(
      dependencies.prettyLog,
      jsonSerializer,
      (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
      rTracerLogger,
    ),
    pool: new Pool(),
  },
  TE.right,
  TE.chainW(({ pool, logger }) => pipe(
    getListsEventsFromDatabase(pool, loggerIO(logger)),
    TE.map(() => (
      {
        getListsEvents: getListsEvents(pool, logger),
        pool,
        logger,
      }
    )),
  )),
);
