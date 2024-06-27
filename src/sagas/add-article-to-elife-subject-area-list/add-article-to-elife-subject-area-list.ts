import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../logger';
import { Queries } from '../../read-models';
import { CommandHandler } from '../../types/command-handler';
import * as EDOI from '../../types/expression-doi';
import { AddArticleToListCommand } from '../../write-side/commands';

type Ports = Pick<Queries, 'getOneArticleReadyToBeListed'> & {
  logger: Logger,
  addArticleToList: CommandHandler<AddArticleToListCommand>,
};

export const addArticleToElifeSubjectAreaList = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'addArticleToElifeSubjectAreaListsSaga starting');
  await pipe(
    adapters.getOneArticleReadyToBeListed(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW((command) => pipe(
      {
        articleId: EDOI.fromValidatedString(command.articleId.value),
        listId: command.listId,
      },
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
