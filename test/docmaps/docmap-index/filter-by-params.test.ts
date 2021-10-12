import { filterByParams } from '../../../src/docmaps/docmap-index/filter-by-params';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('filter-by-params', () => {
  describe('when no params are given', () => {
    it('returns unmodified input', () => {
      const input = [
        {
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: arbitraryDate(),
        },
        {
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: arbitraryDate(),
        },
      ];
      const result = filterByParams('')(input);

      expect(result).toStrictEqual(input);
    });
  });

  describe('when passed a group ID', () => {
    it.todo('only returns entries by that group');
  });

  describe('when passed an "updated after" parameter', () => {
    describe('when there are evaluations after the specified date', () => {
      it.todo('only returns entries whose latest evaluation is after the specified date');
    });

    describe('when there are no evaluations after the specified date', () => {
      it.todo('returns an empty array');
    });
  });
});
