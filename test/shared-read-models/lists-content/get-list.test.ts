import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { articleAddedToList, listCreated, listNameEdited } from '../../../src/domain-events';
import { getList, handleEvent, initialState } from '../../../src/shared-read-models/lists-content';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('get-list', () => {
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

      it('returns the articleIds, sorted by date added, descending', () => {
        expect(getList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          articleIds: [articleId2.value, articleId1.value],
        })));
      });
    });

    describe('and is empty', () => {
      const name = arbitraryString();
      const readModel = pipe(
        [
          listCreated(listId, name, arbitraryString(), arbitraryListOwnerId()),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns articleIds as empty', () => {
        expect(getList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          articleIds: [],
        })));
      });

      it('returns the lists name', () => {
        expect(getList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });
    });

    describe('and has had its name edited', () => {
      const name = arbitraryString();
      const dateOfLatestEvent = new Date();
      const readModel = pipe(
        [
          listCreated(listId, arbitraryString(), arbitraryString(), arbitraryListOwnerId()),
          listNameEdited(listId, name, dateOfLatestEvent),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the latest name', () => {
        expect(getList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });

      it('returns the date of the latest event as the lastUpdated', () => {
        expect(getList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          lastUpdated: dateOfLatestEvent,
        })));
      });
    });
  });

  describe('when the list does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not found', () => {
      expect(getList(readModel)(listId)).toStrictEqual(O.none);
    });
  });
});
