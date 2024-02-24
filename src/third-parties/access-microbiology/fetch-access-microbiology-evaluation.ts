import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error.js';
import { EvaluationFetcher } from '../evaluation-fetcher.js';
import { QueryExternalService } from '../query-external-service.js';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations.js';
import { Logger } from '../../infrastructure/index.js';
import { toJatsXmlUrlOfPublisher } from './to-jats-xml-url-of-publisher.js';
import { acmiEvaluationDoiCodec } from './acmi-evaluation-doi.js';

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => pipe(
  key,
  acmiEvaluationDoiCodec.decode,
  E.mapLeft(() => DE.unavailable),
  E.chainOptionK(() => DE.unavailable)(toJatsXmlUrlOfPublisher),
  TE.fromEither,
  TE.chain(queryExternalService()),
  TE.chainEitherK(deriveFullTextsOfEvaluations(logger)),
  TE.chainEitherKW(lookupFullText(key)),
  TE.map((fullText) => ({
    url: new URL(`https://doi.org/${key}`),
    fullText,
  })),
);
