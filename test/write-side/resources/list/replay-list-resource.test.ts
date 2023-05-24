import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, listCreated } from '../../../../src/domain-events';
import { replayListResource } from '../../../../src/write-side/resources/list/replay-list-resource';
import { arbitraryString } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

describe('replay-list-resource', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    const listName = arbitraryString();
    const listDescription = arbitraryString();

    describe('and an article has been added to the list', () => {
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
          constructEvent('ArticleAddedToList')({ articleId, listId }),
        ],
        replayListResource(listId),
      );

      it('the article id is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [articleId] })));
      });

      it('the list name is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and no article has ever been added to the list', () => {
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
        ],
        replayListResource(listId),
      );

      it('the article id is not in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it('the list name is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and an article used to be on the list and has been removed', () => {
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
          constructEvent('ArticleAddedToList')({ articleId, listId }),
          constructEvent('ArticleRemovedFromList')({ articleId, listId }),
        ],
        replayListResource(listId),
      );

      it('the article id is not in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it('the list name is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the resource', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and the list has been renamed', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), listDescription, arbitraryListOwnerId()),
          constructEvent('ListNameEdited')({ listId, name: listName }),
        ],
        replayListResource(listId),
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
          listCreated(listId, listName, arbitraryString(), arbitraryListOwnerId()),
          constructEvent('ListDescriptionEdited')({ listId, description: listDescription }),
        ],
        replayListResource(listId),
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
      replayListResource(listId),
    );

    it('fails', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
