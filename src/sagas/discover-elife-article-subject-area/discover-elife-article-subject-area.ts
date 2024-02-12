import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi';
import {
  Logger, RecordSubjectArea,
} from '../../shared-ports';
import { Queries } from '../../read-models';
import { ExternalQueries } from '../../third-parties';
import { ArticleId } from '../../types/article-id';

export type Ports = Pick<Queries, 'getOneArticleIdInEvaluatedState'> & ExternalQueries & {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
};

const buildRecordSubjectAreaCommand = (adapters: Ports) => (expressionDoi: EDOI.ExpressionDoi) => pipe(
  expressionDoi,
  adapters.getArticleSubjectArea,
  TE.bimap(
    (error) => {
      adapters.logger(
        'warn',
        'discoverElifeArticleSubjectArea: failed to get article subject area',
        { expressionDoi, error },
      );
      return error;
    },
    (subjectArea) => ({
      articleId: new ArticleId(expressionDoi),
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
