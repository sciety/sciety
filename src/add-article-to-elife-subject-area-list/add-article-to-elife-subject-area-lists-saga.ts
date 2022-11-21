import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getCorrespondingListId } from './read-model';
import { AddArticleToListCommand } from '../commands/add-article-to-list';
import {
  AddArticleToList, Logger,
} from '../shared-ports';
import { Doi } from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import { SubjectArea } from '../types/subject-area';

type Ports = {
  logger: Logger,
  addArticleToList: AddArticleToList,
};

const getOneArticleReadyToBeListed = (): O.Option<ArticleWithSubjectArea> => O.none;

type ArticleWithSubjectArea = { articleId: Doi, subjectArea: SubjectArea };

type BuildAddArticleToSubjectAreaListCommand = (adapters: Ports)
=> (input: ArticleWithSubjectArea)
=> TE.TaskEither<ErrorMessage, AddArticleToListCommand>;

const buildAddArticleToSubjectAreaListCommand: BuildAddArticleToSubjectAreaListCommand = () => (
  input,
) => pipe(
  input.subjectArea.value,
  getCorrespondingListId,
  O.map((listId) => ({
    articleId: input.articleId,
    listId,
  })),
  TE.fromOption(() => toErrorMessage('could not build command')),
);

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
