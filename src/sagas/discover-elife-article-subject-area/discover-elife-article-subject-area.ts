import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi.js';
import { Logger } from '../../infrastructure/index.js';
import { Queries } from '../../read-models/index.js';
import { ExternalQueries } from '../../third-parties/index.js';
import { ArticleId } from '../../types/article-id.js';
import { CommandHandlers } from '../../write-side/command-handlers/index.js';

export type Ports = ExternalQueries
& Pick<Queries, 'getOneArticleIdInEvaluatedState'>
& Pick<CommandHandlers, 'recordSubjectArea'>
& { logger: Logger };

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
