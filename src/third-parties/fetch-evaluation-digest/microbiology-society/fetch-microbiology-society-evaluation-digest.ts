import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations';
import { toJatsXmlUrlOfPublisher } from './to-jats-xml-url-of-publisher';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { QueryExternalService } from '../../query-external-service';
import { EvaluationDigestFetcher } from '../evaluation-digest-fetcher';

const fetchEvaluationDigestFromPublisherJatsXmlEndpoint = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (key: string) => pipe(
  key,
  toJatsXmlUrlOfPublisher,
  TE.fromOption(() => DE.unavailable),
  TE.mapLeft((left) => {
    logger('error', 'Failed to derive JATS XML URL from ACMI evaluation DOI', { acmiEvaluationDoi: key });
    return left;
  }),
  TE.chain(queryExternalService()),
  TE.chainEitherK(deriveFullTextsOfEvaluations(logger)),
  TE.chainEitherKW(lookupFullText(key)),
);

export const fetchMicrobiologySocietyEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key: string) => pipe(
  key,
  fetchEvaluationDigestFromPublisherJatsXmlEndpoint(queryExternalService, logger),
);
