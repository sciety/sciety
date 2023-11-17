import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toOurListsViewModel } from '../../../../../src/html-pages/group-page/group-about-page/construct-view-model/to-our-lists-view-model.js';
import { arbitraryString } from '../../../../helpers.js';
import { arbitraryGroup } from '../../../../types/group.helper.js';
import { arbitraryList } from '../../../../types/list-helper.js';

describe('to-our-lists-view-model', () => {
  const groupSlug = arbitraryGroup().slug;

  describe('when the group has more than three lists', () => {
    const nameOfMostRecentlyUpdatedList = arbitraryString();
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        arbitraryList(),
        { ...arbitraryList(), name: nameOfMostRecentlyUpdatedList },
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

  describe('when the group has two or three lists', () => {
    const nameOfMostRecentlyUpdatedList = arbitraryString();
    const model = pipe(
      [
        arbitraryList(),
        arbitraryList(),
        { ...arbitraryList(), name: nameOfMostRecentlyUpdatedList },
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

  describe('when the group has one list', () => {
    const model = pipe(
      [
        arbitraryList(),
      ],
      toOurListsViewModel(groupSlug),
    );

    it('returns list view models for each list', () => {
      expect(model.lists).toHaveLength(1);
    });

    it('the View All Lists button is not set', () => {
      expect(O.isNone(model.allListsUrl)).toBe(true);
    });
  });
});
