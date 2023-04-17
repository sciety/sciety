import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryList } from '../../types/list-helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/lists';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { selectAllListsContainingArticle } from '../../../src/shared-read-models/lists/select-all-lists-containing-article';
import { arbitraryUserId } from '../../types/user-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('select-all-lists-containing-article', () => {
  describe('when the article is not in any list', () => {
    const readModel = initialState();

    it('returns an empty result', () => {
      expect(selectAllListsContainingArticle(readModel)(arbitraryArticleId())).toStrictEqual([]);
    });
  });

  describe('when the article appears in one list', () => {
    const list = arbitraryList();
    const articleId = arbitraryArticleId();
    const readModel = pipe(
      [
        listCreated(list.id, list.name, list.description, list.ownerId),
        articleAddedToList(articleId, list.id),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns one list', () => {
      expect(selectAllListsContainingArticle(readModel)(articleId)).toStrictEqual([
        expect.objectContaining({ id: list.id }),
      ]);
    });
  });

  describe('when the article appears in a user and a group list', () => {
    const userList = arbitraryList(LOID.fromUserId(arbitraryUserId()));
    const groupList = arbitraryList(LOID.fromGroupId(arbitraryGroupId()));
    const articleId = arbitraryArticleId();
    const readModel = pipe(
      [
        listCreated(userList.id, userList.name, userList.description, userList.ownerId),
        articleAddedToList(articleId, userList.id),
        listCreated(groupList.id, groupList.name, groupList.description, groupList.ownerId),
        articleAddedToList(articleId, groupList.id),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns two lists', () => {
      expect(selectAllListsContainingArticle(readModel)(articleId)).toStrictEqual([
        expect.objectContaining({ id: userList.id }),
        expect.objectContaining({ id: groupList.id }),
      ]);
    });
  });

  describe('when only other articles appear in lists', () => {
    const list = arbitraryList();
    const articleId = arbitraryArticleId();
    const anotherArticleId = arbitraryArticleId();
    const readModel = pipe(
      [
        listCreated(list.id, list.name, list.description, list.ownerId),
        articleAddedToList(anotherArticleId, list.id),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns an empty result', () => {
      expect(selectAllListsContainingArticle(readModel)(articleId)).toStrictEqual([]);
    });
  });
});
