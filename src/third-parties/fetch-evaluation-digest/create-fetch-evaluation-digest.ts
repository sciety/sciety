/* eslint-disable quote-props */
import { pipe } from 'fp-ts/function';
import { fetchDoiEvaluationDigestByPublisher } from './fetch-doi-evaluation-digest-by-publisher';
import { fetchEvaluationDigestFromAppropriateService } from './fetch-evaluation-digest-from-appropriate-service';
import { fetchHypothesisAnnotation } from './hypothesis';
import { fetchMicrobiologySocietyEvaluationDigest } from './microbiology-society';
import { fetchNcrcEvaluationDigest } from './ncrc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRapidReviewsEvaluationDigest } from './rapid-reviews';
import { fetchZenodoRecord } from './zenodo';
import { Logger } from '../../logger';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

export const createFetchEvaluationDigest = (queryExternalService: QueryExternalService, logger: Logger): ExternalQueries['fetchEvaluationDigest'] => pipe(
  {
    doi: fetchDoiEvaluationDigestByPublisher(
      {
        '10.5281': fetchZenodoRecord(queryExternalService, logger),
        '10.1099': fetchMicrobiologySocietyEvaluationDigest(queryExternalService, logger),
      },
      logger,
    ),
    hypothesis: fetchHypothesisAnnotation(queryExternalService, logger),
    ncrc: fetchNcrcEvaluationDigest(logger),
    prelights: fetchPrelightsHighlight(queryExternalService, logger),
    rapidreviews: fetchRapidReviewsEvaluationDigest(queryExternalService, logger),
  },
  fetchEvaluationDigestFromAppropriateService,
);
