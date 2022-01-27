import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { needsToBeAdded } from '../../src/infrastructure/needs-to-be-added';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('needs-to-be-added', () => {
  const evaluationLocator = arbitraryReviewId();
  const eventToAdd = evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), evaluationLocator);

  describe('when the event to be added is an existing event', () => {
    const existingEvents = [
      evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), evaluationLocator),
    ];
    const result = pipe(
      eventToAdd,
      needsToBeAdded(existingEvents),
    );

    it('returns false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when the event to be added is not an existing event', () => {
    const result = pipe(
      eventToAdd,
      needsToBeAdded([]),
    );

    it('returns true', () => {
      expect(result).toBe(true);
    });
  });
});
