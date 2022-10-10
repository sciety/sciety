import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, articleRemovedFromList, listCreated } from '../../../src/domain-events';
import { getList, List } from '../../../src/shared-read-models/lists';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('get-list', () => {
  describe('when the listId does not exist', () => {
    it.todo('returns not-found');
  });

  describe('when the listId does exist', () => {
    describe('and it refers to a non-hardcoded list', () => {
      const listId = arbitraryListId();
      const name = arbitraryString();
      const description = arbitraryString();
      const ownerId = arbitraryListOwnerId();

      describe('when the list is empty', () => {
        describe('because it is a new list', () => {
          const creationDate = arbitraryDate();
          let result: List;

          beforeEach(async () => {
            result = await pipe(
              [
                listCreated(listId, name, description, ownerId, creationDate),
              ],
              getList(listId),
              TE.getOrElse(shouldNotBeCalled),
            )();
          });

          it('returns non-dynamic metadata sourced from list creation event', () => {
            expect(result).toStrictEqual(expect.objectContaining({
              name,
              description,
              ownerId,
            }));
          });

          it('returns the list id', () => {
            expect(result.id).toStrictEqual(listId);
          });

          it('returns the list creation date as the last updated date', () => {
            expect(result.lastUpdated).toStrictEqual(creationDate);
          });

          it('returns an articleCount of 0', () => {
            expect(result.articleCount).toBe(0);
          });
        });

        describe('an was added and then removed', () => {
          const creationDate = arbitraryDate();
          const articleId = arbitraryArticleId();
          let result: List;

          beforeEach(async () => {
            result = await pipe(
              [
                listCreated(listId, name, description, ownerId, creationDate),
                articleAddedToList(articleId, listId),
                articleRemovedFromList(articleId, listId),
              ],
              getList(listId),
              TE.getOrElse(shouldNotBeCalled),
            )();
          });

          it('returns non-dynamic metadata sourced from list creation event', () => {
            expect(result).toStrictEqual(expect.objectContaining({
              name,
              description,
              ownerId,
            }));
          });

          it('returns the list id', () => {
            expect(result.id).toStrictEqual(listId);
          });

          it.failing('returns the list creation date as the last updated date', () => {
            expect(result.lastUpdated).toStrictEqual(creationDate);
          });

          it.failing('returns an articleCount of 0', () => {
            expect(result.articleCount).toBe(0);
          });
        });
      });

      describe('when the list is non-empty', () => {
        const latestDate = arbitraryDate();
        let result: List;

        beforeEach(async () => {
          result = await pipe(
            [
              listCreated(listId, name, description, ownerId),
              articleAddedToList(arbitraryArticleId(), listId, arbitraryDate()),
              articleAddedToList(arbitraryArticleId(), listId, latestDate),
            ],
            getList(listId),
            TE.getOrElse(shouldNotBeCalled),
          )();
        });

        it('returns non-dynamic metadata sourced from list creation event', () => {
          expect(result).toStrictEqual(expect.objectContaining({
            name,
            description,
            ownerId,
          }));
        });

        it('returns the list id', () => {
          expect(result.id).toStrictEqual(listId);
        });

        it('returns date of last addition to list as the last updated date', () => {
          expect(result.lastUpdated).toStrictEqual(latestDate);
        });

        it('returns an articleCount of 2', () => {
          expect(result.articleCount).toBe(2);
        });
      });
    });
  });
});
