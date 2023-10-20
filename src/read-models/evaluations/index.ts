import { evaluationsStatus } from './evaluations-status';
import { getEvaluationsByGroup } from './get-evaluations-by-group';
import { getEvaluationsForArticle } from './get-evaluations-for-article';
import { getEvaluationsWithNoType } from './get-evaluations-with-no-type';
import { handleEvent, initialState } from './handle-event';

export const evaluations = {
  queries: {
    evaluationsStatus,
    getEvaluationsForArticle,
    getEvaluationsByGroup,
    getEvaluationsWithNoType,
  },
  initialState,
  handleEvent,
};
