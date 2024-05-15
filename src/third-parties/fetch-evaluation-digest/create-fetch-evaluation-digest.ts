/* eslint-disable quote-props */
import { pipe } from 'fp-ts/function';
import { fetchAccessMicrobiologyEvaluationDigest } from './access-microbiology';
import { fetchDoiEvaluationDigestByPublisher } from './fetch-doi-evaluation-digest-by-publisher';
import { fetchEvaluationFromAppropriateService } from './fetch-evaluation-from-appropriate-service';
import { fetchHypothesisAnnotation } from './hypothesis';
import { fetchNcrcEvaluationDigest } from './ncrc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRapidReview } from './rapid-reviews';
import { fetchZenodoRecord } from './zenodo';
import { Logger } from '../../shared-ports';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

export const createFetchEvaluationDigest = (queryExternalService: QueryExternalService, logger: Logger): ExternalQueries['fetchEvaluationDigest'] => pipe(
  {
    doi: fetchDoiEvaluationDigestByPublisher(
      {
        '10.5281': fetchZenodoRecord(queryExternalService, logger),
        '10.1099': fetchAccessMicrobiologyEvaluationDigest(queryExternalService, logger),
      },
      logger,
    ),
    hypothesis: fetchHypothesisAnnotation(queryExternalService, logger),
    ncrc: fetchNcrcEvaluationDigest(logger),
    prelights: fetchPrelightsHighlight(queryExternalService, logger),
    rapidreviews: fetchRapidReview(queryExternalService, logger),
  },
  fetchEvaluationFromAppropriateService,
);
