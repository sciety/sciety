import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { listCreated } from '../../../src/domain-events/list-created-event';
import { handleEvent, initialState, isArticleOnTheListOwnedBy } from '../../../src/shared-read-models/lists-owned-by-users';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('is-article-on-the-list-owned-by', () => {
  const articleId = arbitraryArticleId();
  const listId = arbitraryListId();
  const userId = arbitraryUserId();

  describe('when the user has added an article to the list', () => {
    const readModel = pipe(
      [
        listCreated(listId, arbitraryString(), arbitraryString(), LOID.fromUserId(userId)),
        articleAddedToList(articleId, listId),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('the query returns true', () => {
      expect(isArticleOnTheListOwnedBy(readModel)(userId)(articleId)).toBe(true);
    });
  });

  describe('when the user has added and removed an article', () => {
    it.todo('the query returns false');
  });

  describe('when two users have added articles', () => {
    it.todo('the query returns true for the first user id');

    it.todo('the query returns true for the second user id');
  });
});
