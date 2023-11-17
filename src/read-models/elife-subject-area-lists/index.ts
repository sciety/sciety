import { handleEvent, initialState } from './handle-event.js';
import { getArticleIdsByState } from './get-article-ids-by-state.js';
import { getOneArticleIdInEvaluatedState } from './get-one-article-id-in-evaluated-state.js';
import { getOneArticleReadyToBeListed } from './get-one-article-ready-to-be-listed.js';
import { elifeArticleStatus } from './elife-article-status.js';

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
