import { handleEvent, initialState } from './handle-event';
import { getArticleIdsByState } from './get-article-ids-by-state';
import { getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { getOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';

export const addArticleToElifeSubjectAreaList = {
  queries: {
    getArticleIdsByState,
    getOneArticleIdInEvaluatedState,
    getOneArticleReadyToBeListed,
  },
  initialState,
  handleEvent,
};
