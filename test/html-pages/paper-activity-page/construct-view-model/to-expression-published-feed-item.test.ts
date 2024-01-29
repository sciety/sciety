import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { arbitraryPaperExpression } from '../../../types/paper-expression.helper';
import {
  toExpressionPublishedFeedItem,
} from '../../../../src/html-pages/paper-activity-page/construct-view-model/to-expression-published-feed-item';
import { articleServers } from '../../../../src/types/article-server';
import { arbitraryColdSpringHarborArticleServer, arbitraryNonColdSpringHarborArticleServer } from '../../../types/article-server.helper';
import { arbitraryNonColdSpringHarborExpressionDoi } from '../../../types/expression-doi.helper';

describe('to-expression-published-feed-item', () => {
  describe('given a paper expression from a known server, that is not a ColdSpringHarborServer', () => {
    const server = arbitraryNonColdSpringHarborArticleServer();
    const expression = {
      ...arbitraryPaperExpression(),
      expressionDoi: arbitraryNonColdSpringHarborExpressionDoi(),
      server: O.some(server),
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo contains the server name', () => {
      expect(item.publishedTo).toContain(articleServers[server].name);
    });

    it('publishedTo contains the DOI of the expression', () => {
      expect(item.publishedTo).toContain(expression.expressionDoi);
    });
  });

  describe('given a paper expression from a known server, that is a ColdSpringHarborServer', () => {
    const server = arbitraryColdSpringHarborArticleServer();
    const expression = {
      ...arbitraryPaperExpression(),
      publisherHtmlUrl: new URL('https://www.biorxiv.org/content/10.1101/2023.07.25.550600v2'),
      server: O.some(server),
    };
    const item = toExpressionPublishedFeedItem(expression);

    it('publishedTo contains the server name', () => {
      expect(item.publishedTo).toContain(articleServers[server].name);
    });

    it.failing('publishedTo contains the path for the expression\'s url on that server', () => {
      expect(item.publishedTo).toContain(expression.expressionDoi);

      expect(item.publishedTo).toContain('v2');
    });
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
