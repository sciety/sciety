import * as O from 'fp-ts/Option';
import { identifyExpressionServer } from '../../../src/third-parties/crossref/fetch-all-paper-expressions/identify-expression-server.js';
import { arbitraryUri } from '../../helpers.js';

describe('identify expression server', () => {
  it.each([
    ['medrxiv', 'http://medrxiv.org/lookup/doi/10.1101/2021.01.15.21249880'],
    ['biorxiv', 'http://biorxiv.org/lookup/doi/10.1101/2020.07.04.187583'],
    ['researchsquare', 'https://www.researchsquare.com/article/rs-955726/v1'],
    ['scielopreprints', 'https://preprints.scielo.org/index.php/scielo/preprint/view/3564/version/3775'],
  ])('detects %s correctly', (expectedServer, resourceUrl) => {
    const server = identifyExpressionServer(resourceUrl);

    expect(server).toStrictEqual(O.some(expectedServer));
  });

  describe('when the resource is not supported', () => {
    it('returns O.none', () => {
      const server = identifyExpressionServer(arbitraryUri());

      expect(server).toStrictEqual(O.none);
    });
  });
});
