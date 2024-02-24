import { arbitraryBoolean, arbitraryString } from '../../../helpers.js';
import { buildPageUrl } from '../../../../src/html-pages/search-results-page/render-as-html/build-page-url.js';

describe('build-page-url', () => {
  const defaultParams = {
    query: arbitraryString(),
    evaluatedOnly: arbitraryBoolean(),
  };

  it('builds the URL with the correct query', () => {
    const query = 'a search term';
    const result = buildPageUrl({
      ...defaultParams,
      query,
    });

    expect(result).toContain('query=a%20search%20term');
  });

  it('builds the URL with a query with special characters', () => {
    const query = 'covid&cells';
    const result = buildPageUrl({
      ...defaultParams,
      query,
    });

    expect(result).toContain('query=covid%26cells');
  });

  describe('when evaluatedOnly is true', () => {
    it('builds the URL with the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        ...defaultParams,
        evaluatedOnly: true,
      });

      expect(result).toContain('evaluatedOnly=true');
    });
  });

  describe('when evaluatedOnly is false', () => {
    it('builds the URL without the evaluatedOnly filter set', () => {
      const result = buildPageUrl({
        ...defaultParams,
        evaluatedOnly: false,
      });

      expect(result).not.toContain('evaluatedOnly');
    });
  });
});
