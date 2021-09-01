import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { filterBy } from '../../../src/docmaps/docmap-index/filter-by';
import { arbitraryDoi } from '../../types/doi.helper';

describe('filter-by', () => {
  describe('when updatedAfter is not specified', () => {
    it('returns all DOIs unfiltered', () => {
      const inputDois = [
        arbitraryDoi(),
        arbitraryDoi(),
        arbitraryDoi(),
      ];
      const filtered = pipe(
        inputDois,
        filterBy({ updatedAfter: O.none }),
      );

      expect(filtered).toStrictEqual(inputDois);
    });
  });

  describe('when updatedAfter is a valid date', () => {
    it.todo('only returns DOIs that were updated after the date');
  });
});
