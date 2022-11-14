import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList } from '../../../src/domain-events/article-added-to-list-event';
import { listCreated } from '../../../src/domain-events/list-created-event';
import { handleEvent, initialState } from '../../../src/shared-read-models/lists-owned-by-users/handle-event';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('handle-event', () => {
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

    it.failing('the article id is listed against the user id', () => {
      expect(readModel[userId]).toBe([articleId]);
    });
  });

  describe('when the user has added and removed an article', () => {
    it.todo('the article id is not listed against the user id');
  });

  describe('when two users have added articles', () => {
    it.todo('the article id is listed against the first user id');

    it.todo('the article id is listed against the second user id');
  });
});
