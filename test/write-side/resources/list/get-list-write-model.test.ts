import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events/index.js';
import { getListWriteModel } from '../../../../src/write-side/resources/list/get-list-write-model.js';
import { arbitraryString } from '../../../helpers.js';
import { arbitraryArticleId } from '../../../types/article-id.helper.js';
import { arbitraryListId } from '../../../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper.js';

describe('get-list-write-model', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    const listName = arbitraryString();
    const listDescription = arbitraryString();

    describe('and an article used to be on the list and has been removed', () => {
      const result = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: listName,
            description: listDescription,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ArticleAddedToList')({ articleId, listId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        ],
        getListWriteModel(listId),
      );

      it('the article id is not in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articles: [] })));
      });
    });

    describe('and the list has been renamed', () => {
      const result = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: arbitraryString(),
            description: listDescription,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListNameEdited')({ listId, name: listName }),
        ],
        getListWriteModel(listId),
      );

      it('the list name is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description remains the same', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and the list description has been changed', () => {
      const result = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: listName,
            description: arbitraryString(),
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListDescriptionEdited')({ listId, description: listDescription }),
        ],
        getListWriteModel(listId),
      );

      it('the list name remains the same', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [
      ],
      getListWriteModel(listId),
    );

    it('fails', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
