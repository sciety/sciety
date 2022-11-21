import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  AddArticleToList, Logger,
} from '../shared-ports';

type Ports = {
  logger: Logger,
  addArticleToList: AddArticleToList,
};

const getOneArticleReadyToBeListed = (): O.Option<unknown> => O.none;

const buildAddArticleToSubjectAreaListCommand = () => () => TE.left('could not build command');

export const addArticleToElifeSubjectAreaListsSaga = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'addArticleToElifeSubjectAreaListsSaga starting');
  await pipe(
    getOneArticleReadyToBeListed(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW(buildAddArticleToSubjectAreaListCommand()),
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
