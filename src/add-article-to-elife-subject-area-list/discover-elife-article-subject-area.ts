import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ArticleIdsByState } from './read-model-status';
import { GetArticleSubjectArea, Logger, RecordSubjectArea } from '../shared-ports';
import { Doi } from '../types/doi';

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  getArticleSubjectArea: GetArticleSubjectArea,
  getArticleIdsByState: () => ArticleIdsByState,
};

export const discoverElifeArticleSubjectArea = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'discoverElifeArticleSubjectArea starting');
  await pipe(
    adapters.getArticleIdsByState(),
    (articleIdsByState) => articleIdsByState.evaluated,
    RA.head,
    TE.fromOption(() => 'no work to do'),
    TE.map((articleId) => new Doi(articleId)),
    TE.chainW((articleId) => pipe(
      articleId,
      adapters.getArticleSubjectArea,
      TE.map((subjectArea) => ({
        articleId,
        subjectArea,
      })),
    )),
    TE.chainW(adapters.recordSubjectArea),
  )();
  adapters.logger('info', 'discoverElifeArticleSubjectArea finished');
};
