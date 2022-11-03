import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetArticleSubjectArea, Logger, RecordSubjectArea } from '../shared-ports';
import { Doi } from '../types/doi';

type Ports = {
  logger: Logger,
  recordSubjectArea: RecordSubjectArea,
  getArticleSubjectArea: GetArticleSubjectArea,
};

export const discoverElifeArticleSubjectArea = async (ports: Ports): Promise<void> => {
  ports.logger('info', 'discoverElifeArticleSubjectArea starting');
  await pipe(
    new Doi('10.1101/1234'),
    ports.getArticleSubjectArea,
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
