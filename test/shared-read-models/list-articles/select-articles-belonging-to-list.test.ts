import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated } from '../../../src/domain-events';
import { selectArticlesBelongingToList } from '../../../src/shared-read-models/list-articles';
import * as DE from '../../../src/types/data-error';
import { arbitraryString } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('select-articles-belonging-to-list', () => {
  const listId = arbitraryListId();

  describe('when the list exists', () => {
    describe('and contains articles', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryGroupId()),
          articleAddedToList(articleId1, listId, new Date('2019')),
          articleAddedToList(articleId2, listId, new Date('2021')),
        ],
        selectArticlesBelongingToList(listId),
      );

      it('returns the articleIds, sorted by date added, descending', () => {
        expect(result).toStrictEqual(E.right([articleId2, articleId1]));
      });
    });

    describe('and is empty', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryGroupId()),
        ],
        selectArticlesBelongingToList(listId),
      );

      it('returns an empty array', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [],
      selectArticlesBelongingToList(listId),
    );

    it('returns not found', () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
