import { handleEvent, initialState } from './handle-event';
import { getArticleIdsByState } from './get-article-ids-by-state';
import { getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state';
import { getOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed';
import { elifeArticleStatus } from './elife-article-status';

export const elifeSubjectAreaLists = {
  queries: {
    elifeArticleStatus,
    getArticleIdsByState,
    getOneArticleIdInEvaluatedState,
    getOneArticleReadyToBeListed,
  },
  initialState,
  handleEvent,
};
