import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryList } from '../../types/list-helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/lists';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { selectAllListsContainingArticle } from '../../../src/shared-read-models/lists/select-all-lists-containing-article';

describe('select-all-lists-containing-article', () => {
  describe('when the article is not in any list', () => {
    it.todo('returns an empty result');
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

    it.failing('returns one list', () => {
      expect(selectAllListsContainingArticle(readModel)(articleId)).toStrictEqual([
        expect.objectContaining({ id: list.id }),
      ]);
    });
  });

  describe('when the article appears in a user and a group list', () => {
    it.todo('returns two lists');
  });

  describe('when only other articles appear in lists', () => {
    it.todo('returns an empty result');
  });
});
