/* eslint-disable quote-props */
import { pipe } from 'fp-ts/function';
import { fetchNcrcReview } from './ncrc';
import { fetchRapidReview } from './rapid-reviews';
import { fetchEvaluationFromAppropriateService } from './fetch-evaluation-from-appropriate-service';
import { fetchHypothesisAnnotation } from '../hypothesis/fetch-hypothesis-annotation';
import { fetchZenodoRecord } from '../zenodo/fetch-zenodo-record';
import { fetchPrelightsHighlight } from '../prelights';
import { Logger } from '../../shared-ports';
import { fetchDoiEvaluationByPublisher } from '../fetch-doi-evaluation-by-publisher';
import { fetchAccessMicrobiologyEvaluation } from '../access-microbiology';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';

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
