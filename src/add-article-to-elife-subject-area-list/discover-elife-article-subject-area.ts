import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetArticleSubjectArea, Logger, RecordSubjectArea } from '../shared-ports';
import { Doi } from '../types/doi';

export type GetOneArticleIdInEvaluatedState = () => O.Option<Doi>;

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  getArticleSubjectArea: GetArticleSubjectArea,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
};

const buildRecordSubjectAreaCommand = (adapters: Ports) => (articleId: Doi) => pipe(
  articleId,
  adapters.getArticleSubjectArea,
  TE.bimap(
    (error) => {
      adapters.logger(
        'warn',
        'discoverElifeArticleSubjectArea: failed to get article subject area',
        { articleId, error },
      );
      return error;
    },
    (subjectArea) => ({
      articleId,
      subjectArea,
    }),
  ),
);

export const discoverElifeArticleSubjectArea = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'discoverElifeArticleSubjectArea starting');
  await pipe(
    adapters.getOneArticleIdInEvaluatedState(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW(buildRecordSubjectAreaCommand(adapters)),
    TE.chainW((command) => pipe(
      command,
      adapters.recordSubjectArea,
      TE.mapLeft(
        (error) => {
          adapters.logger(
            'error',
            'discoverElifeArticleSubjectArea: the command has failed',
            { command, error },
          );
          return error;
        },
      ),
    )),
  )();
  adapters.logger('info', 'discoverElifeArticleSubjectArea finished');
};
