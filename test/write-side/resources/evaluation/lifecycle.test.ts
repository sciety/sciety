import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { erase, update, record } from '../../../../src/write-side/resources/evaluation';
import { arbitraryEvaluationType } from '../../../types/evaluation-type.helper';
import { DomainEvent } from '../../../../src/domain-events';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../../types/recorded-evaluation.helper';

describe('lifecycle', () => {
  describe('record -> erase -> update', () => {
    let result: unknown;
    const evaluation = arbitraryRecordedEvaluation();
    const evaluationLocator = evaluation.evaluationLocator;

    beforeEach(() => {
      const events: Array<DomainEvent> = [];
      const eventsFromRecord = pipe(
        events,
        record({
          groupId: evaluation.groupId,
          publishedAt: evaluation.publishedAt,
          evaluationLocator: evaluation.evaluationLocator,
          articleId: evaluation.articleId,
          authors: evaluation.authors,
        }),
        E.getOrElseW(shouldNotBeCalled),
      );
      events.push(...eventsFromRecord);
      const eventsFromErase = pipe(
        events,
        erase({
          evaluationLocator,
        }),
        E.getOrElseW(shouldNotBeCalled),
      );
      events.push(...eventsFromErase);
      result = update({
        evaluationLocator,
        evaluationType: arbitraryEvaluationType(),
      })(events);
    });

    it.skip('errors with not found', () => {
      expect(result).toStrictEqual(E.left('Evaluation to be updated does not exist'));
    });
  });
});
