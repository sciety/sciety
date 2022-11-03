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

const foo = (adapters: Ports) => (articleId: Doi) => pipe(
  articleId,
  adapters.getArticleSubjectArea,
  TE.map((subjectArea) => ({
    articleId,
    subjectArea,
  })),
);

export const discoverElifeArticleSubjectArea = async (adapters: Ports): Promise<void> => {
  adapters.logger('info', 'discoverElifeArticleSubjectArea starting');
  await pipe(
    adapters.getOneArticleIdInEvaluatedState(),
    TE.fromOption(() => 'no work to do'),
    TE.chainW(foo(adapters)),
    TE.chainW(adapters.recordSubjectArea),
  )();
  adapters.logger('info', 'discoverElifeArticleSubjectArea finished');
};
