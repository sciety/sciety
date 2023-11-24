import { findAllVersionsForArticleId } from './find-all-versions-for-article-id';
import { handleEvent, initialState } from './handle-event';
import { findExpressionOfArticleAsDoi } from './find-expression-of-article-as-doi';

export const articleExpressions = {
  queries: {
    findAllVersionsForArticleId,
    findExpressionOfArticleAsDoi,
  },
  initialState,
  handleEvent,
};
