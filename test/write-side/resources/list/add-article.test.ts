import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../../src/domain-events';
import { toUnsafeUserInput } from '../../../../src/types/unsafe-user-input';
import { addArticle } from '../../../../src/write-side/resources/list/add-article';
import { arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../../domain-events/list-resource-events.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryLongUnsafeUserInput, arbitraryUnsafeUserInput } from '../../../types/unsafe-user-input.helper';

describe('add-article', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();

  describe('when the list exists', () => {
    describe('and the article is already in the list', () => {
      const result = pipe(
        [
          {
            ...arbitraryListCreatedEvent(),
            listId,
          },
          constructEvent('ExpressionAddedToList')({ expressionDoi, listId }),
        ],
        addArticle({
          listId,
          expressionDoi,
        }),
      );

      it('accepts the command and causes no state change', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article is not in the list', () => {
      describe('when no annotation is provided in the command', () => {
        let result: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          result = pipe(
            [
              {
                ...arbitraryListCreatedEvent(),
                listId,
              },
            ],
            addArticle({
              listId,
              expressionDoi,
            }),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('causes a state change in which the article is added to the list', () => {
          expect(result).toHaveLength(1);
          expect(result[0]).toBeDomainEvent('ExpressionAddedToList', {
            expressionDoi,
            listId,
          });
        });
      });

      describe('when an annotation is provided in the command', () => {
        const annotation = arbitraryUnsafeUserInput();
        let result: ReadonlyArray<DomainEvent>;

        beforeEach(() => {
          result = pipe(
            [
              {
                ...arbitraryListCreatedEvent(),
                listId,
              },
            ],
            addArticle({
              listId,
              expressionDoi,
              annotation,
            }),
            E.getOrElseW(shouldNotBeCalled),
          );
        });

        it('causes a state change in which both the article is added to the list, and that article is annotated in the list', () => {
          expect(result).toHaveLength(2);
          expect(result[0]).toBeDomainEvent('ExpressionAddedToList', {
            expressionDoi,
            listId,
          });
          expect(result[1]).toBeDomainEvent('ExpressionInListAnnotated', {
            expressionDoi,
            listId,
            content: annotation,
          });
        });
      });

      describe('when an annotation that is too long is provided in the command', () => {
        const annotationTooLong = arbitraryLongUnsafeUserInput(5000);
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            expressionDoi,
            annotation: annotationTooLong,
          }),
        );

        it('rejects the command with "Annotation too long"', () => {
          expect(result).toStrictEqual(E.left('Annotation too long'));
          expect(E.isLeft(result)).toBe(true);
        });
      });

      describe('when an annotation is provided as an empty string in the command', () => {
        const result = pipe(
          [
            {
              ...arbitraryListCreatedEvent(),
              listId,
            },
          ],
          addArticle({
            listId,
            expressionDoi,
            annotation: toUnsafeUserInput(''),
          }),
        );

        it('rejects the command', () => {
          expect(E.isLeft(result)).toBe(true);
        });
      });
    });
  });

  describe('when no list with the given id has ever existed', () => {
    const result = pipe(
      [],
      addArticle({
        listId: arbitraryListId(),
        expressionDoi: arbitraryExpressionDoi(),
      }),
    );

    it('rejects the command', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when a list with the given id existed and was then deleted', () => {
    const listCreatedEvent = arbitraryListCreatedEvent();
    const result = pipe(
      [
        listCreatedEvent,
        {
          ...arbitraryListDeletedEvent(),
          listId: listCreatedEvent.listId,
        },
      ],
      addArticle({
        listId: listCreatedEvent.listId,
        expressionDoi: arbitraryExpressionDoi(),
      }),
    );

    it('rejects the command', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
