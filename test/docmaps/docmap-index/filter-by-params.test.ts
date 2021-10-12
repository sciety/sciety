import { DocmapIndexEntryModel } from '../../../src/docmaps/docmap-index/docmap-index-entry-models';
import { filterByParams } from '../../../src/docmaps/docmap-index/filter-by-params';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('filter-by-params', () => {
  describe('when no params are given', () => {
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

    let result: ReadonlyArray<DocmapIndexEntryModel>;

    beforeEach(() => {
      result = filterByParams('')(input);
    });

    it('returns unmodified input', () => {
      expect(result).toStrictEqual(input);
    });
  });

  describe('when passed a group ID', () => {
    it.skip('only returns entries by that group', () => {
      const requestedGroupId = arbitraryGroupId();
      const input = [
        {
          articleId: arbitraryDoi(),
          groupId: requestedGroupId,
          updated: arbitraryDate(),
        },
        {
          articleId: arbitraryDoi(),
          groupId: arbitraryGroupId(),
          updated: arbitraryDate(),
        },
      ];
      const result = filterByParams(`group=${requestedGroupId}`)(input);

      expect(result).toStrictEqual([
        expect.objectContaining({
          groupId: requestedGroupId,
        }),
      ]);
    });
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
