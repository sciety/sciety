import { enqueueAllRelatedDoisNotYetCollected } from '../../../src/third-parties/crossref/fetch-all-paper-expressions-from-crossref';

describe('enqueue-all-related-dois-not-yet-collected', () => {
  describe('when there no records', () => {
    const initialRecords = new Map();
    const result = enqueueAllRelatedDoisNotYetCollected({ collectedRecords: initialRecords, queue: [] });

    it('the collected records are unchanged', () => {
      expect(result.collectedRecords).toStrictEqual(initialRecords);
    });

    it('the queue is empty', () => {
      expect(result.queue).toStrictEqual([]);
    });
  });
});
