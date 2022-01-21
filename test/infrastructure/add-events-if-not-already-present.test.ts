import { evaluationRecorded } from '../../src/domain-events';
import { addEventIfNotAlreadyPresent } from '../../src/infrastructure/add-event-if-not-already-present';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('add-events-if-not-already-present', () => {
  const evaluationLocator = arbitraryReviewId();
  const eventToAdd = evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), evaluationLocator);

  describe('when the event to be added is an existing event', () => {
    const existingEvents = [
      evaluationRecorded(arbitraryGroupId(), arbitraryDoi(), evaluationLocator),
    ];
    const result = addEventIfNotAlreadyPresent(existingEvents, eventToAdd);

    it.skip('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the event to be added is not an existing event', () => {
    const result = addEventIfNotAlreadyPresent([], eventToAdd);

    it('returns an the event in an array', () => {
      expect(result).toStrictEqual([eventToAdd]);
    });
  });
});
