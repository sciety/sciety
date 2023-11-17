import { evaluationsStatus } from './evaluations-status.js';
import { getEvaluationsByGroup } from './get-evaluations-by-group.js';
import { getEvaluationsForArticle } from './get-evaluations-for-article.js';
import { getEvaluationsWithNoType } from './get-evaluations-with-no-type.js';
import { handleEvent, initialState } from './handle-event.js';

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
