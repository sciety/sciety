/* eslint-disable @typescript-eslint/no-unused-vars */
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType } from '../../../src/domain-events';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryArticleAddedToListEvent } from '../../domain-events/list-resource-events.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

type ReadModel = unknown;

const initialState = () => ({});

const handleEvent = (readModel: ReadModel, event: DomainEvent) => readModel;

const getQueueOfEvaluatedExpressions = (readModel: ReadModel) => () => [];

describe('get-queue-of-evaluated-expressions', () => {
  describe('when an evaluation publication has been recorded', () => {
    const readModel = pipe(
      [
        arbitraryEvaluationPublicationRecordedEvent(),
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      getQueueOfEvaluatedExpressions(readModel)(),
    );

    it.failing('returns one element in the queue', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when an evaluation publication has been recorded and the corresponding expression has been added to the list', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const readModel = pipe(
      [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          articleId: expressionDoi,
        } satisfies EventOfType<'EvaluationPublicationRecorded'>,
        {
          ...arbitraryArticleAddedToListEvent(),
          articleId: new ArticleId(expressionDoi),
        } satisfies EventOfType<'ArticleAddedToList'>,
      ],
      RA.reduce(initialState(), handleEvent),
    );
    const result = pipe(
      getQueueOfEvaluatedExpressions(readModel)(),
    );

    it('returns no elements in the queue', () => {
      expect(result).toHaveLength(0);
    });
  });
});
