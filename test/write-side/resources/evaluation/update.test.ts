import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { update } from '../../../../src/write-side/resources/evaluation';
import { evaluationRecordedHelper } from '../../../types/evaluation-recorded-event.helper';
import { arbitraryRecordedEvaluation } from '../../../types/recorded-evaluation.helper';

describe('update', () => {
  describe('when the evaluation locator has been recorded', () => {
    describe('when the evaluation type has not been recorded', () => {
      const evaluation = arbitraryRecordedEvaluation();
      const command = {
        evaluationLocator: evaluation.evaluationLocator,
        evaluationType: 'author-response' as const,
      };

      const events = pipe(
        [
          evaluationRecordedHelper(
            evaluation.groupId,
            evaluation.articleId,
            evaluation.evaluationLocator,
            evaluation.authors,
            evaluation.publishedAt,
            new Date(),
            undefined,
          ),
        ],
        update(command),
      );

      it.failing('returns an EvaluationUpdated event', () => {
        expect(events).toStrictEqual(E.right([expect.objectContaining({
          type: 'EvaluationUpdated',
          evaluationLocator: command.evaluationLocator,
          evaluationType: command.evaluationType,
        })]));
      });
    });

    describe('when the evaluation type has been recorded', () => {
      describe('and it is the same value as the one being passed in', () => {
        it.todo('returns no events');
      });

      describe('and it is not the same value as the one being passed in', () => {
        it.todo('returns an EvaluationUpdated event');
      });
    });
  });

  describe('when the evaluation locator has not been recorded', () => {
    it.todo('fails');
  });
});
