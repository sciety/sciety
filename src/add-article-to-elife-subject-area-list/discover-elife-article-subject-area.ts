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

export const discoverElifeArticleSubjectArea = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleSubjectArea starting');
  await pipe(
    ports.getArticleIdsByState(),
    (articleIdsByState) => articleIdsByState.evaluated,
    RA.head,
    TE.fromOption(() => 'no work to do'),
    TE.map((articleId) => new Doi(articleId)),
    TE.chainW(ports.getArticleSubjectArea),
    TE.chain((subjectArea) => pipe(
      {
        articleId: new Doi('10.1101/1234'),
        subjectArea,
      },
      ports.recordSubjectArea,
    )),
  )();
  ports.logger('info', 'discoverElifeArticleSubjectArea finished');
};
