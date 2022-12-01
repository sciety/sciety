import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, articleRemovedFromList, listCreated } from '../../src/domain-events';
import { listNameEdited } from '../../src/domain-events/list-name-edited-event';
import { replayListResource } from '../../src/shared-write-models/replay-list-resource';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('replay-aggregate', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and an article has been added to the list', () => {
      const listName = arbitraryString();
      const listDescription = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
          articleAddedToList(articleId, listId),
        ],
        replayListResource(listId),
      );

      it('the article id is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [articleId] })));
      });

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and no article has ever been added to the list', () => {
      const listName = arbitraryString();
      const listDescription = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
        ],
        replayListResource(listId),
      );

      it('the article id is not in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and an article used to be on the list and has been removed', () => {
      const listName = arbitraryString();
      const listDescription = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, listName, listDescription, arbitraryListOwnerId()),
          articleAddedToList(articleId, listId),
          articleRemovedFromList(articleId, listId),
        ],
        replayListResource(listId),
      );

      it('the article id is not in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and the list has been renamed', () => {
      const listName = arbitraryString();
      const listDescription = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), listDescription, arbitraryListOwnerId()),
          listNameEdited(listId, listName),
        ],
        replayListResource(listId),
      );

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });

      it('the list description remains the same', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ description: listDescription })));
      });
    });

    describe('and the list description has been changed', () => {
      it.todo('the list name remains the same');

      it.todo('the list description is in the aggregate');
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
