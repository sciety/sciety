import * as O from 'fp-ts/Option';
import { renderAuthors } from '../../../../../src/read-side/html-pages/paper-activity-page/render-as-html/render-authors';
import { arbitraryString } from '../../../../helpers';

describe('render-authors', () => {
  describe('when there are authors', () => {
    it('returns an ordered list', () => {
      const result = renderAuthors(O.some([arbitraryString()]));

      expect(result.startsWith('<ol')).toBe(true);
    });
  });

  describe('when there is no authors list', () => {
    it('returns empty string', () => {
      const result = renderAuthors(O.none);

      expect(result).toBe('');
    });
  });

  describe('when the authors list is empty', () => {
    it('returns empty string', () => {
      const result = renderAuthors(O.some([]));

      expect(result).toBe('');
    });
  });
});
