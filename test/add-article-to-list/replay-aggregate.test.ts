import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { replayAggregate } from '../../src/add-article-to-list/replay-aggregate';
import { articleAddedToList, listCreated } from '../../src/domain-events';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';

describe('replay-aggregate', () => {
  const listId = arbitraryListId();
  const articleId = arbitraryArticleId();

  describe('when the list exists', () => {
    describe('and an article has been added to the list', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
          articleAddedToList(articleId, listId),
        ],
        replayAggregate(listId),
      );

      it('the article id is in the aggregate', () => {
        expect(result).toStrictEqual(E.right({ articleIds: [articleId] }));
      });
    });

    describe('and no article has ever been added to the list', () => {
      const result = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
        ],
        replayAggregate(listId),
      );

      it('the article id is not in the aggregate', () => {
        expect(result).toStrictEqual(E.right({ articleIds: [] }));
      });
    });

    describe('and an article used to be on the list and has been removed', () => {
      it.todo('the article id is not in the aggregate');
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [
      ],
      replayAggregate(listId),
    );

    it('fails', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
