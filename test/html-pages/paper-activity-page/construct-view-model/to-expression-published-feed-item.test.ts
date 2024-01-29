import * as O from 'fp-ts/Option';
import { arbitraryPaperExpression } from '../../../types/paper-expression.helper';
import {
  toExpressionPublishedFeedItem,
} from '../../../../src/html-pages/paper-activity-page/construct-view-model/to-expression-published-feed-item';
import { articleServers } from '../../../../src/types/article-server';
import { arbitraryArticleServer } from '../../../types/article-server.helper';

describe('to-expression-published-feed-item', () => {
  describe.skip('given a paper expression from a known server, that is not a ColdSpringHarborServer', () => {
    const server = arbitraryArticleServer();
    const paperExpression = arbitraryPaperExpression();
    const expression = {
      ...paperExpression,
      server: O.some(server),
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo contains the server name', () => {
      expect(item.publishedTo).toContain(articleServers[server].name);
    });

    it('publishedTo contains the DOI of the expression', () => {
      expect(item.publishedTo).toContain(paperExpression.expressionDoi);

      expect(item.publishedTo).not.toContain('v');
    });
  });

  describe.skip('given a paper expression from a known server, that is a ColdSpringHarborServer', () => {
    const server = arbitraryArticleServer();
    const paperExpression = arbitraryPaperExpression();
    const expression = {
      ...paperExpression,
      server: O.some(server),
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo contains the server name', () => {
      expect(item.publishedTo).toContain(articleServers[server].name);
    });

    it.todo('publishedTo contains the path for the expression\'s url on that server');
  });

  describe('given a paper expression from an unknown server', () => {
    const expression = {
      ...arbitraryPaperExpression(),
      server: O.none,
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo contains the DOI of the expression', () => {
      expect(item.publishedTo).toContain(expression.expressionDoi);
    });
  });
});
