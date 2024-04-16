/* eslint-disable quote-props */
import { pipe } from 'fp-ts/function';
import { fetchAccessMicrobiologyEvaluation } from './access-microbiology';
import { fetchDoiEvaluationByPublisher } from './fetch-doi-evaluation-by-publisher';
import { fetchEvaluationFromAppropriateService } from './fetch-evaluation-from-appropriate-service';
import { fetchHypothesisAnnotation } from './hypothesis';
import { fetchNcrcReview } from './ncrc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRapidReview } from './rapid-reviews';
import { fetchZenodoRecord } from './zenodo';
import { Logger } from '../../shared-ports';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

export const createFetchEvaluation = (queryExternalService: QueryExternalService, logger: Logger): ExternalQueries['fetchEvaluation'] => pipe(
  {
    doi: fetchDoiEvaluationByPublisher(
      {
        '10.5281': fetchZenodoRecord(queryExternalService, logger),
        '10.1099': fetchAccessMicrobiologyEvaluation(queryExternalService, logger),
      },
      logger,
    ),
    hypothesis: fetchHypothesisAnnotation(queryExternalService, logger),
    ncrc: fetchNcrcReview(logger),
    prelights: fetchPrelightsHighlight(queryExternalService, logger),
    rapidreviews: fetchRapidReview(queryExternalService, logger),
  },
  fetchEvaluationFromAppropriateService,
);
