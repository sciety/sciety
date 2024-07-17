import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { List } from '../../../src/read-models/lists';
import { ReadModel, handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { lookupList } from '../../../src/read-models/lists/lookup-list';
import { rawUserInput } from '../../../src/read-side';
import { ArticleId } from '../../../src/types/article-id';
import * as EDOI from '../../../src/types/expression-doi';
import { ListId } from '../../../src/types/list-id';
import { arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryListId } from '../../types/list-id.helper';

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
      const expressionDoi1 = arbitraryExpressionDoi();
      const expressionDoi2 = arbitraryExpressionDoi();
      const readModel = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
            name,
            description,
          },
          constructEvent('ArticleAddedToList')({
            articleId: new ArticleId(expressionDoi1),
            listId,
            date: new Date('2019'),
          }),
          constructEvent('ArticleAddedToList')({
            articleId: new ArticleId(expressionDoi2),
            listId,
            date: new Date('2021'),
          }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the list name', () => {
        const result = runQuery(listId, readModel);

        expect(result.name).toStrictEqual(name);
      });

      it('returns the list description', () => {
        const result = runQuery(listId, readModel);

        expect(result.description).toStrictEqual(rawUserInput(description));
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
          constructEvent('ArticleAddedToList')({
            articleId: new ArticleId(expressionDoi1),
            listId,
          }),
          constructEvent('ArticleAddedToList')({
            articleId: new ArticleId(expressionDoi2),
            listId,
          }),
          constructEvent('ArticleRemovedFromList')({
            articleId: new ArticleId(expressionDoi2),
            listId,
          }),
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
          {
            ...arbitraryListCreatedEvent(),
            listId,
            name,
            description,
          },
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
        expect(runQuery(listId, readModel).description).toStrictEqual(rawUserInput(description));
      });
    });

    describe('and has had its name edited', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const dateOfLatestEvent = arbitraryDate();
      const readModel = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
            description,
          },
          constructEvent('ListNameEdited')({ listId, name, date: dateOfLatestEvent }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the latest name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the same list description', () => {
        expect(runQuery(listId, readModel).description).toStrictEqual(rawUserInput(description));
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
          {
            ...arbitraryListCreatedEvent(),
            listId,
            name,
          },
          constructEvent('ListDescriptionEdited')({ listId, description, date: dateOfLatestEvent }),
        ],
        RA.reduce(initialState(), handleEvent),
      );

      it('returns the same list name', () => {
        expect(runQuery(listId, readModel).name).toStrictEqual(name);
      });

      it('returns the latest description', () => {
        expect(runQuery(listId, readModel).description).toStrictEqual(rawUserInput(description));
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

  describe('when the list has been deleted', () => {
    const readModel = pipe(
      [
        {
          ...arbitraryListCreatedEvent(),
          listId,
        },
        {
          ...arbitraryListDeletedEvent(),
          listId,
        },
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns not found', () => {
      expect(lookupList(readModel)(listId)).toStrictEqual(O.none);
    });
  });
});
