import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { AddArticleToListCommand } from '../commands/add-article-to-list';
import {
  AddArticleToList, Logger,
} from '../shared-ports';
import { ErrorMessage, toErrorMessage } from '../types/error-message';

type Ports = {
  logger: Logger,
  addArticleToList: AddArticleToList,
};

const getOneArticleReadyToBeListed = (): O.Option<unknown> => O.none;

type BuildAddArticleToSubjectAreaListCommand = (adapters: Ports)
=> ()
=> TE.TaskEither<ErrorMessage, AddArticleToListCommand>;

const buildAddArticleToSubjectAreaListCommand: BuildAddArticleToSubjectAreaListCommand = () => () => TE.left(toErrorMessage('could not build command'));

export const addArticleToElifeSubjectAreaListsSaga = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'addArticleToElifeSubjectAreaListsSaga starting');
  await pipe(
    getOneArticleReadyToBeListed(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW(buildAddArticleToSubjectAreaListCommand(adapters)),
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
