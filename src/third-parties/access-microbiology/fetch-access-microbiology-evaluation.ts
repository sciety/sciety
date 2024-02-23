import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { QueryExternalService } from '../query-external-service';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations';
import { Logger } from '../../shared-ports';
import { toJatsXmlUrlOfPublisher } from './to-jats-xml-url-of-publisher';

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => pipe(
  key,
  toJatsXmlUrlOfPublisher,
  TE.fromOption(() => DE.unavailable),
  TE.chain(queryExternalService()),
  TE.chainEitherK(deriveFullTextsOfEvaluations(logger)),
  TE.chainEitherKW(lookupFullText(key)),
  TE.map((fullText) => ({
    url: new URL(`https://doi.org/${key}`),
    fullText,
  })),
);
