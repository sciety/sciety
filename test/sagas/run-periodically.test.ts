import { runPeriodically, Saga } from '../../src/sagas/run-periodically';
import { dummyLogger } from '../dummy-logger';
import { arbitraryNumber } from '../helpers';

describe('run-periodically', () => {
  describe('given a saga that executes faster than the period', () => {
    const periodInSeconds = arbitraryNumber(1, 100);
    const iterations = arbitraryNumber(2, 10);
    let counter: number;

    const saga: Saga = async () => {
      counter += 1;
    };

    beforeEach(async () => {
      jest.useFakeTimers();
      counter = 0;
      runPeriodically(dummyLogger, saga, periodInSeconds);
      await jest.advanceTimersByTimeAsync(periodInSeconds * 1000 * iterations);
    });

    it('allows all iterations to run', () => {
      expect(counter).toBe(iterations);
    });
  });

  describe('given a saga that takes longer to run than the period', () => {
    it.todo('prevents concurrent execution of the saga');
  });
});
