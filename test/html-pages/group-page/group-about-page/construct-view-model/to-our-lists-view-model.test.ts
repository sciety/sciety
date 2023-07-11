import * as O from 'fp-ts/Option';
import * as LOID from '../../../../../src/types/list-owner-id';
import { toOurListsViewModel } from '../../../../../src/html-pages/group-page/group-about-page/construct-view-model/to-our-lists-view-model';
import { arbitraryString } from '../../../../helpers';
import { arbitraryGroup } from '../../../../types/group.helper';
import { arbitraryList } from '../../../../types/list-helper';
import { TestFramework, createTestFramework } from '../../../../framework';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-about-page/view-model';

describe('to-our-lists-view-model', () => {
  let framework: TestFramework;
  let model: ViewModel['ourLists'];
  const group = arbitraryGroup();
  const groupSlug = group.slug;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has more than three lists', () => {
    const nameOfMostRecentlyUpdatedList = arbitraryString();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group); // 1 list by default
      await framework.commandHelpers.createList(arbitraryList(LOID.fromGroupId(group.id)));
      await framework.commandHelpers.createList(arbitraryList(LOID.fromGroupId(group.id)));
      await framework.commandHelpers.createList({
        ...arbitraryList(LOID.fromGroupId(group.id)),
        name: nameOfMostRecentlyUpdatedList,
      });

      model = toOurListsViewModel(framework.queries, group.id, groupSlug);
    });

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

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group); // 1 list by default
      await framework.commandHelpers.createList(arbitraryList(LOID.fromGroupId(group.id)));
      await framework.commandHelpers.createList({
        ...arbitraryList(LOID.fromGroupId(group.id)),
        name: nameOfMostRecentlyUpdatedList,
      });

      model = toOurListsViewModel(framework.queries, group.id, groupSlug);
    });

    it('returns list view models for each list', () => {
      expect(model.lists).toHaveLength(3);
    });

    it('the View All Lists button is not set', () => {
      expect(O.isNone(model.allListsUrl)).toBe(true);
    });
  });

  describe('when the group has one list', () => {
    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group); // 1 list by default

      model = toOurListsViewModel(framework.queries, group.id, groupSlug);
    });

    it('returns list view models for each list', () => {
      expect(model.lists).toHaveLength(1);
    });

    it('the View All Lists button is not set', () => {
      expect(O.isNone(model.allListsUrl)).toBe(true);
    });
  });

  describe('when the group has no lists', () => {
    it.todo('tbd');
  });
});
