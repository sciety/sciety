import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { getListsEvents } from './get-lists-events';
import { listsReadModel } from './lists-read-model';
import { Ports } from './ports';
import {
  jsonSerializer, rTracerLogger, streamLogger,
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
  },
  ({ logger }) => ({
    getListsEvents: getListsEvents(new Pool(), logger),
    logger,
  }),
  (partial) => ({
    listsReadModel: listsReadModel(partial.getListsEvents, partial.logger),
    logger: partial.logger,
  }),
  TE.right,
);
