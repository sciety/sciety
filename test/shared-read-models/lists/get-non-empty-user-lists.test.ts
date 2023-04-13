import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { getNonEmptyUserLists } from '../../../src/shared-read-models/lists/get-non-empty-user-lists';
import { arbitraryList } from '../../types/list-helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/lists';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('get-non-empty-user-lists', () => {
  describe('when there are populated user lists', () => {
    const userList1 = arbitraryList();
    const userList2 = arbitraryList();
    const readModel = pipe(
      [
        listCreated(userList1.id, userList1.name, userList1.description, userList1.ownerId),
        listCreated(userList2.id, userList2.name, userList2.description, userList2.ownerId),
        articleAddedToList(arbitraryArticleId(), userList1.id),
        articleAddedToList(arbitraryArticleId(), userList2.id),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns only the populated user lists', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([
        expect.objectContaining({ id: userList1.id }),
        expect.objectContaining({ id: userList2.id }),
      ]);
    });
  });

  describe('when the only user lists are empty', () => {
    const userList1 = arbitraryList();
    const userList2 = arbitraryList();
    const readModel = pipe(
      [
        listCreated(userList1.id, userList1.name, userList1.description, userList1.ownerId),
        listCreated(userList2.id, userList2.name, userList2.description, userList2.ownerId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are only group lists', () => {
    const groupList = arbitraryList(LOID.fromGroupId(arbitraryGroupId()));
    const readModel = pipe(
      [
        listCreated(groupList.id, groupList.name, groupList.description, groupList.ownerId),
        articleAddedToList(arbitraryArticleId(), groupList.id),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are no lists', () => {
    it.todo('returns an empty result');
  });
});
