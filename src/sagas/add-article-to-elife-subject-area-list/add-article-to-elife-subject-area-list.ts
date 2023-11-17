import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../shared-ports/index.js';
import { Queries } from '../../read-models/index.js';
import { CommandHandlers } from '../../write-side/command-handlers.js';

type Ports = Pick<Queries, 'getOneArticleReadyToBeListed'>
& Pick<CommandHandlers, 'addArticleToList'>
& {
  logger: Logger,
};

export const addArticleToElifeSubjectAreaList = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'addArticleToElifeSubjectAreaListsSaga starting');
  await pipe(
    adapters.getOneArticleReadyToBeListed(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW((command) => pipe(
      command,
      adapters.addArticleToList,
      TE.mapLeft(
        (error) => {
          adapters.logger(
            'error',
            'addArticleToElifeSubjectAreaListsSaga : the command has failed',
            { command, error },
          );
          return error;
        },
      ),
    )),
  )();
  adapters.logger('info', 'addArticleToElifeSubjectAreaListsSaga finished');
};
