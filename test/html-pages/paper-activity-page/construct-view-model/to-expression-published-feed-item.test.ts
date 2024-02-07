import * as O from 'fp-ts/Option';
import { arbitraryPaperExpression } from '../../../types/paper-expression.helper';
import {
  toExpressionPublishedFeedItem,
} from '../../../../src/html-pages/paper-activity-page/construct-view-model/to-expression-published-feed-item';
import { arbitraryArticleServer } from '../../../types/article-server.helper';

describe('to-expression-published-feed-item', () => {
  describe('given a paper expression from a known server', () => {
    const server = arbitraryArticleServer();
    const expression = {
      ...arbitraryPaperExpression(),
      server: O.some(server),
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo is the publishedTo of the expression', () => {
      expect(item.publishedTo).toStrictEqual(expression.publishedTo);
    });
  });

  describe('given a paper expression from an unknown server', () => {
    const expression = {
      ...arbitraryPaperExpression(),
      server: O.none,
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo is the publishedTo of the expression', () => {
      expect(item.publishedTo).toStrictEqual(expression.publishedTo);
    });
  });
});
