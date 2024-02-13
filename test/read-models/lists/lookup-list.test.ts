import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../src/domain-events';
import { handleEvent, initialState } from '../../../src/read-models/lists/handle-event';
import { lookupList } from '../../../src/read-models/lists/lookup-list';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryListCreatedEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { ArticleId } from '../../../src/types/article-id';

describe('lookup-list', () => {
  const listId = arbitraryListId();

  describe('when the list exists', () => {
    describe('and contains articles', () => {
      const name = arbitraryString();
      const description = arbitraryString();
      const articleId1 = arbitraryArticleId();
      const articleId2 = arbitraryArticleId();
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
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });

      it('returns the list description', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          description,
        })));
      });

      it('returns the added papers as list entries', () => {
        const result = pipe(
          listId,
          lookupList(readModel),
          O.getOrElseW(shouldNotBeCalled),
          (list) => list.entries,
          RA.map((entry) => entry.expressionDoi),
        );

        expect(result).toContain(articleId1.value);
        expect(result).toContain(articleId2.value);
      });

      it('returns list versions that reflect the order in which the papers were added', () => {
        const firstVersion = pipe(
          listId,
          lookupList(readModel),
          O.getOrElseW(shouldNotBeCalled),
          (list) => list.entries,
          RA.findFirst((entry) => entry.expressionDoi === articleId1.value),
          O.getOrElseW(shouldNotBeCalled),
          (entry) => entry.addedAtListVersion,
        );

        const secondVersion = pipe(
          listId,
          lookupList(readModel),
          O.getOrElseW(shouldNotBeCalled),
          (list) => list.entries,
          RA.findFirst((entry) => entry.expressionDoi === articleId2.value),
          O.getOrElseW(shouldNotBeCalled),
          (entry) => entry.addedAtListVersion,
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
        listId,
        lookupList(readModel),
        O.getOrElseW(shouldNotBeCalled),
        (list) => list.entries,
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
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          entries: [],
        })));
      });

      it('returns the lists name', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });

      it('returns the list description', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          description,
        })));
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
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });

      it('returns the same list description', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          description,
        })));
      });

      it('returns the date of the latest event as the updatedAt', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          updatedAt: dateOfLatestEvent,
        })));
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
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          name,
        })));
      });

      it('returns the latest description', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          description,
        })));
      });

      it('returns the date of the latest event as the updatedAt', () => {
        expect(lookupList(readModel)(listId)).toStrictEqual(O.some(expect.objectContaining({
          updatedAt: dateOfLatestEvent,
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
      expect(lookupList(readModel)(listId)).toStrictEqual(O.none);
    });
  });
});
