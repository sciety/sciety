import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toOurListsViewModel } from '../../../src/group-page/about/to-our-lists-view-model';
import { List } from '../../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryNumber, arbitraryString } from '../../helpers';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

// eslint-disable-next-line jest/no-export
export const arbitraryList = (): List => ({
  id: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  articleCount: arbitraryNumber(0, 100),
  lastUpdated: arbitraryDate(),
  ownerId: arbitraryListOwnerId(),
});

describe('to-our-lists-view-model', () => {
  const groupSlug = arbitraryGroup().slug;

  describe('when the group has more than three lists', () => {
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
      ],
      toOurListsViewModel(groupSlug),
    );

    it('returns list view models for only three lists', () => {
      expect(model.lists).toHaveLength(3);
    });

    it('the View All Lists button is set', () => {
      expect(O.isSome(model.allListsUrl)).toBe(true);
    });

    it('the View All Lists button is a link to the lists tab', () => {
      expect(model.allListsUrl).toStrictEqual(O.some(`/groups/${groupSlug}/lists`));
    });
  });

  describe('when the group has three or fewer lists', () => {
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
      ],
      toOurListsViewModel(groupSlug),
    );

    it('returns list view models for each list', () => {
      expect(model.lists).toHaveLength(3);
    });

    it('the View All Lists button is not set', () => {
      expect(O.isNone(model.allListsUrl)).toBe(true);
    });
  });

  describe('when the group has no lists', () => {
    it.todo('tbd');
  });
});
