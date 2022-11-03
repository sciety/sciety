import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  GetArticleIdsByState, GetArticleSubjectArea, Logger, RecordSubjectArea,
} from '../shared-ports';
import { Doi } from '../types/doi';

export type GetOneArticleIdInEvaluatedState = () => O.Option<Doi>;

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  getArticleSubjectArea: GetArticleSubjectArea,
  getArticleIdsByState: GetArticleIdsByState,
  getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
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
