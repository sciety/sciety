import * as O from 'fp-ts/Option';
import { renderAuthors } from '../../../src/article-page/meta-page/render-authors';
import { arbitraryString } from '../../helpers';

describe('render-authors', () => {
  describe('when there are authors', () => {
    it('returns an ordered list', () => {
      const result = renderAuthors(O.some([arbitraryString()]));

      expect(result.startsWith('<ol')).toBe(true);
    });
  });

  describe('when there is no authors list', () => {
    it.todo('returns empty string');
  });

  describe('when the authors list is empty', () => {
    it.todo('returns empty string');
  });
});
