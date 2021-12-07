import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { raiseEventsIfNecessary } from '../../src/record-evaluation/raise-events-if-necessary';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('raise-events-if-necessary', () => {
  describe('when the evaluation locator has NOT already been recorded', () => {
    it.todo('returns an EvaluationRecorded event');
  });

  describe('when the evaluation locator has already been recorded', () => {
    const evaluationLocator = arbitraryReviewId();
    const input = {
      groupId: arbitraryGroupId(),
      articleId: arbitraryDoi(),
      evaluationLocator,
      publishedAt: arbitraryDate(),
    };
    const events = pipe(
      [
        evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), evaluationLocator),
      ],
      raiseEventsIfNecessary(input),
    );

    it('returns no events', () => {
      expect(events).toStrictEqual([]);
    });
  });
});
