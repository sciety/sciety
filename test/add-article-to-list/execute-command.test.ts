import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { executeCommand } from '../../src/add-article-to-list/execute-command';
import { articleAddedToList } from '../../src/domain-events/article-added-to-list-event';
import { listCreated } from '../../src/domain-events/list-created-event';
import { arbitraryString } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-command', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryDoi();

  describe('when the list exists', () => {
    describe('and the article is already on the list', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryGroupId()),
          articleAddedToList(articleId, listId),
        ],
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds with no events raised', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article was never on the list', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryGroupId()),
        ],
        executeCommand({
          listId,
          articleId,
        }),
      );

      it('succeeds and raises an event', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'ArticleAddedToList',
          articleId,
          listId,
        })]));
      });
    });

    describe('and the article used to be on the list and was removed', () => {
      it.todo('succeeds and raises an event');
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [
      ],
      executeCommand({
        listId,
        articleId,
      }),
    );

    it('fails with no events raised', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
