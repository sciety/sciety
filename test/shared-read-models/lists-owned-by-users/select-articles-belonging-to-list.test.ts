import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, articleRemovedFromList, listCreated } from '../../../src/domain-events';
import { handleEvent, initialState, selectArticlesBelongingToList } from '../../../src/shared-read-models/lists-owned-by-users';
import * as DE from '../../../src/types/data-error';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('select-articles-belonging-to-list', () => {
  const listId = arbitraryListId();

  describe('when the list exists', () => {
    describe('and contains articles', () => {
      const articleId1 = arbitraryArticleId();
      const articleId2 = arbitraryArticleId();
      const readModel = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
          articleAddedToList(articleId1, listId, new Date('2019')),
          articleAddedToList(articleId2, listId, new Date('2021')),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it.failing('returns the articleIds, sorted by date added, descending', () => {
        expect(selectArticlesBelongingToList(readModel)(listId)).toStrictEqual(E.right([articleId2, articleId1]));
      });
    });

    describe('and is empty', () => {
      describe('because it is new', () => {
        const readModel = pipe(
          [
            listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        it.failing('returns an empty array', () => {
          expect(selectArticlesBelongingToList(readModel)(listId)).toStrictEqual(E.right([]));
        });
      });

      describe('because an article has been added and removed', () => {
        const articleId = arbitraryArticleId();
        const readModel = pipe(
          [
            listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
            articleAddedToList(articleId, listId),
            articleRemovedFromList(articleId, listId),
          ],
          RA.reduce(initialState(), handleEvent),
        );

        it.failing('returns an empty array', () => {
          expect(selectArticlesBelongingToList(readModel)(listId)).toStrictEqual(E.right([]));
        });
      });
    });
  });

  describe('when the list does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not found', () => {
      expect(selectArticlesBelongingToList(readModel)(listId)).toStrictEqual(E.left(DE.notFound));
    });
  });
});
