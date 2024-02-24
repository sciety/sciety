import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { getNonEmptyUserLists } from '../../../src/read-models/lists/get-non-empty-user-lists.js';
import { arbitraryList } from './list-helper.js';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event.js';
import { constructEvent } from '../../../src/domain-events/index.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import * as LOID from '../../../src/types/list-owner-id.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';
import { arbitraryUserId } from '../../types/user-id.helper.js';

describe('get-non-empty-user-lists', () => {
  describe('when there are populated user lists', () => {
    const userList1 = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const userList2 = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId: userList1.id,
          name: userList1.name,
          description: userList1.description,
          ownerId: userList1.ownerId,
        }),
        constructEvent('ListCreated')({
          listId: userList2.id,
          name: userList2.name,
          description: userList2.description,
          ownerId: userList2.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId: arbitraryArticleId(), listId: userList1.id }),
        constructEvent('ArticleAddedToList')({ articleId: arbitraryArticleId(), listId: userList2.id }),
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
    const userList1 = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const userList2 = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const readModel = pipe(
      [
        constructEvent('ListCreated')({
          listId: userList1.id,
          name: userList1.name,
          description: userList1.description,
          ownerId: userList1.ownerId,
        }),
        constructEvent('ListCreated')({
          listId: userList2.id,
          name: userList2.name,
          description: userList2.description,
          ownerId: userList2.ownerId,
        }),
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
        constructEvent('ListCreated')({
          listId: groupList.id,
          name: groupList.name,
          description: groupList.description,
          ownerId: groupList.ownerId,
        }),
        constructEvent('ArticleAddedToList')({ articleId: arbitraryArticleId(), listId: groupList.id }),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });

  describe('when there are no lists', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(getNonEmptyUserLists(readModel)()).toStrictEqual([]);
    });
  });
});
