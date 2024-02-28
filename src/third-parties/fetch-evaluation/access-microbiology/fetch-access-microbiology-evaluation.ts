import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { EvaluationFetcher } from '../evaluation-fetcher';
import { QueryExternalService } from '../../query-external-service';
import { deriveFullTextsOfEvaluations, lookupFullText } from './derive-full-texts-of-evaluations';
import { Logger } from '../../../shared-ports';
import { toJatsXmlUrlOfPublisher } from './to-jats-xml-url-of-publisher';
import * as EFK from './evaluation-fetcher-key';

const fetchEvaluationFromPublisherJatsXmlEndpoint = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (evaluationFetcherKey: EFK.EvaluationFetcherKey) => pipe(
  evaluationFetcherKey,
  toJatsXmlUrlOfPublisher,
  TE.fromOption(() => DE.unavailable),
  TE.mapLeft((left) => {
    logger('error', 'Failed to derive JATS XML URL from ACMI evaluation DOI', { acmiEvaluationDoi: evaluationFetcherKey });
    return left;
  }),
  TE.chain(queryExternalService()),
  TE.chainEitherK(deriveFullTextsOfEvaluations(logger)),
  TE.chainEitherKW(lookupFullText(evaluationFetcherKey)),
  TE.map((fullText) => ({
    url: new URL(`https://doi.org/${evaluationFetcherKey}`),
    fullText,
  })),

);

export const fetchAccessMicrobiologyEvaluation = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (key: string) => pipe(
  key,
  EFK.fromValidatedString,
  fetchEvaluationFromPublisherJatsXmlEndpoint(queryExternalService, logger),
);