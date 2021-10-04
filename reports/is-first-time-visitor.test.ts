import { isFirstTimeVisitor } from './is-first-time-visitor';
import { arbitraryWord } from '../test/helpers';

describe('isFirstTimeVisitor', () => {
  const nextVisitorId = arbitraryWord();

  describe('when no visitors have been seen before', () => {
    const seenBefore: ReadonlyArray<string> = [];

    it('marks the next visitor as a first timer', () => {
      const firstTimers = isFirstTimeVisitor(seenBefore, nextVisitorId);

      expect(firstTimers).toStrictEqual([nextVisitorId]);
    });
  });

  describe('when the visitor has been seen before', () => {
    const visitorId1 = arbitraryWord();
    const visitorId2 = arbitraryWord();
    const seenBefore: ReadonlyArray<string> = [
      visitorId1, nextVisitorId, visitorId2,
    ];

    it('ignores the visitor', () => {
      const firstTimers = isFirstTimeVisitor(seenBefore, nextVisitorId);

      expect(firstTimers).toStrictEqual(seenBefore);
    });
  });

  describe('when the visitor has not been seen before', () => {
    const visitorId1 = arbitraryWord();
    const visitorId2 = arbitraryWord();
    const seenBefore: ReadonlyArray<string> = [
      visitorId1, visitorId2,
    ];

    it('marks the next visitor as a first timer', () => {
      const firstTimers = isFirstTimeVisitor(seenBefore, nextVisitorId);

      expect(firstTimers).toStrictEqual([visitorId1, visitorId2, nextVisitorId]);
    });
  });
});
