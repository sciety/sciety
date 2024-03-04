import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../../src/types/expression-doi';
import { constructEvent } from '../../../src/domain-events';
import { ReadModel, handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { lookupList } from '../../../src/read-models/lists/lookup-list';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { ArticleId } from '../../../src/types/article-id';
import { ListId } from '../../../src/types/list-id';
import { List } from '../../../src/read-models/lists';
import { accessRawValue } from '../../../src/read-side';

const runQuery = (listId: ListId, readModel: ReadModel) => pipe(
  listId,
  lookupList(readModel),
  O.getOrElseW(shouldNotBeCalled),
);

const getListEntries = (listId: ListId, readModel: ReadModel) => pipe(
  runQuery(listId, readModel),
  (list) => list.entries,
);

const getVersion = (expressionDoi: EDOI.ExpressionDoi) => (entries: List['entries']) => pipe(
  entries,
  RA.findFirst((entry) => entry.expressionDoi === expressionDoi),
  O.getOrElseW(shouldNotBeCalled),
  (entry) => entry.addedAtListVersion,
);

describe('lookup-list', () => {
  const listId = arbitraryListId();

  describe('when the list exists', () => {
    describe('and contains articles', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const articleId1 = arbitraryArticleId();
      const expressionDoi1 = EDOI.fromValidatedString(articleId1.value);
      const articleId2 = arbitraryArticleId();
      const expressionDoi2 = EDOI.fromValidatedString(articleId2.value);
      const readModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name,
            description,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ArticleAddedToList')({ articleId: articleId1, listId, date: new Date('2019') }),
          constructEvent('ArticleAddedToList')({ articleId: articleId2, listId, date: new Date('2021') }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the list name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the list description', () => {
        expect(accessRawValue(runQuery(listId, readModel).description)).toStrictEqual(description);
      });

      it('returns the added papers as list entries', () => {
        const result = pipe(
          getListEntries(listId, readModel),
          RA.map((entry) => entry.expressionDoi),
        );

        expect(result).toContain(expressionDoi1);
        expect(result).toContain(expressionDoi2);
      });

      it('returns list versions that reflect the order in which the papers were added', () => {
        const firstVersion = pipe(
          getListEntries(listId, readModel),
          getVersion(expressionDoi1),
        );

        const secondVersion = pipe(
          getListEntries(listId, readModel),
          getVersion(expressionDoi2),
        );

        expect(secondVersion).toBeGreaterThan(firstVersion);
      });
    });

    describe('and an paper has been removed', () => {
      const expressionDoi1 = arbitraryExpressionDoi();
      const expressionDoi2 = arbitraryExpressionDoi();
      const readModel = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
          },
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi1), listId }),
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi2), listId }),
          constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi2), listId }),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = pipe(
        getListEntries(listId, readModel),
        RA.map((entry) => entry.expressionDoi),
      );

      it('returns only the remaining papers', () => {
        expect(result).toStrictEqual([expressionDoi1]);
      });
    });

    describe('and is empty', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const readModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name,
            description,
            ownerId: arbitraryListOwnerId(),
          }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns entries as empty', () => {
        expect(getListEntries(listId, readModel)).toHaveLength(0);
      });

      it('returns the lists name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the list description', () => {
        expect(accessRawValue(runQuery(listId, readModel).description)).toStrictEqual(description);
      });
    });

    describe('and has had its name edited', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const dateOfLatestEvent = arbitraryDate();
      const readModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: arbitraryString(),
            description,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListNameEdited')({ listId, name, date: dateOfLatestEvent }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the latest name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the same list description', () => {
        expect(accessRawValue(runQuery(listId, readModel).description)).toStrictEqual(description);
      });

      it('returns the date of the latest event as the updatedAt', () => {
        expect(runQuery(listId, readModel).updatedAt).toStrictEqual(dateOfLatestEvent);
      });
    });

    describe('and has had its description edited', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const dateOfLatestEvent = arbitraryDate();
      const readModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name,
            description: arbitraryString(),
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListDescriptionEdited')({ listId, description, date: dateOfLatestEvent }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the same list name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the latest description', () => {
        expect(accessRawValue(runQuery(listId, readModel).description)).toStrictEqual(description);
      });

      it('returns the date of the latest event as the updatedAt', () => {
        expect(runQuery(listId, readModel).updatedAt).toStrictEqual(dateOfLatestEvent);
      });
    });
  });

  describe('when the list does not exist', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not found', () => {
      expect(lookupList(readModel)(listId)).toStrictEqual(O.none);
    });
  });
});
