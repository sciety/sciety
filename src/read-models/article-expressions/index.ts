import { findAllVersionsForArticleId } from './find-all-versions-for-article-id';
import { handleEvent, initialState } from './handle-event';

export const articleExpressions = {
  queries: {
    findAllVersionsForArticleId,
  },
  initialState,
  handleEvent,
};
