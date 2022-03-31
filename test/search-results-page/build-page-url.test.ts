import { buildPageUrl } from '../../src/search-results-page/build-page-url';
import { arbitraryBoolean, arbitraryString } from '../helpers';

const arbitraryCategory = () => (arbitraryBoolean() ? 'articles' : 'groups');

describe('build-page-url', () => {
  it('builds the URL with the correct category', () => {
    const result = buildPageUrl({
      category: 'articles',
      query: arbitraryString(),
      evaluatedOnly: arbitraryBoolean(),
    });

    expect(result).toContain('category=articles');
  });

  it('builds the URL with the correct query', () => {
    const query = 'a search term';
    const result = buildPageUrl({
      query,
      category: arbitraryCategory(),
      evaluatedOnly: arbitraryBoolean(),
    });

    expect(result).toContain(`query=${query}`);
  });

  describe('when evaluatedOnly is true', () => {
    it.todo('builds the URL with the evaluatedOnly filter set');
  });

  describe('when evaluatedOnly is false', () => {
    it.todo('builds the URL without the evaluatedOnly filter set');
  });
});
