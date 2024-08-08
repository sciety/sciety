/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { ListId } from '../../../src/types/list-id';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryListId } from '../../types/list-id.helper';

type ReadModel = Record<ListId, Array<ExpressionDoi>>;

const initialState = () => ({});

const handleEvent = (readModel: ReadModel, event: DomainEvent) => readModel;

const getQueueOfEvaluatedExpressions = (readModel: ReadModel) => (listId: ListId) => O.some([]);

describe('get-queue-of-evaluated-expressions', () => {
  describe('when a group has evaluated multiple expressions of the same paper', () => {
    const readModel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      arbitraryListId(),
      getQueueOfEvaluatedExpressions(readModel),
      O.getOrElseW(shouldNotBeCalled),
    );

    it.failing('returns only one expression doi', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a group has evaluated different papers', () => {
    it.todo('returns one expression per paper');
  });
});
