import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, articleRemovedFromList, listCreated } from '../../src/domain-events';
import { listNameEdited } from '../../src/domain-events/list-name-edited-event';
import { replayListAggregate } from '../../src/shared-write-models/replay-list-aggregate';
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
      const result = pipe(
        [
          listCreated(listId, listName, arbitraryString(), arbitraryListOwnerId()),
          articleAddedToList(articleId, listId),
        ],
        replayListAggregate(listId),
      );

      it('the article id is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [articleId] })));
      });

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });
    });

    describe('and no article has ever been added to the list', () => {
      const listName = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, listName, arbitraryString(), arbitraryListOwnerId()),
        ],
        replayListAggregate(listId),
      );

      it('the article id is not in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });
    });

    describe('and an article used to be on the list and has been removed', () => {
      const listName = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, listName, arbitraryString(), arbitraryListOwnerId()),
          articleAddedToList(articleId, listId),
          articleRemovedFromList(articleId, listId),
        ],
        replayListAggregate(listId),
      );

      it('the article id is not in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ articleIds: [] })));
      });

      it.failing('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });
    });

    describe('and the list has been renamed', () => {
      const listName = arbitraryString();
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
          listNameEdited(listId, listName),
        ],
        replayListAggregate(listId),
      );

      it.failing('the list name is in the aggregate', () => {
        expect(result).toStrictEqual(E.right(expect.objectContaining({ name: listName })));
      });
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [
      ],
      replayListAggregate(listId),
    );

    it('fails', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
