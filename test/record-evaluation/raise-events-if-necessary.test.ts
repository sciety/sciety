import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { raiseEventsIfNecessary } from '../../src/record-evaluation/raise-events-if-necessary';
import { arbitraryDate, arbitraryString } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('raise-events-if-necessary', () => {
  const evaluationLocator = arbitraryReviewId();
  const input = {
    groupId: arbitraryGroupId(),
    articleId: arbitraryDoi(),
    evaluationLocator,
    publishedAt: arbitraryDate(),
    authors: [arbitraryString(), arbitraryString()],
  };

  describe('when the evaluation locator has NOT already been recorded', () => {
    const events = pipe(
      [],
      raiseEventsIfNecessary(input),
    );

    it('returns an EvaluationRecorded event', () => {
      expect(events).toStrictEqual([expect.objectContaining({
        type: 'EvaluationRecorded',
        groupId: input.groupId,
        articleId: input.articleId,
        evaluationLocator: input.evaluationLocator,
        publishedAt: input.publishedAt,
        authors: input.authors,
      })]);
    });
  });

  describe('when the evaluation locator has already been recorded', () => {
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
