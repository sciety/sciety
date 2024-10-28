import { runPeriodically, Saga } from '../../src/sagas/run-periodically';
import { dummyLogger } from '../dummy-logger';
import { arbitraryNumber } from '../helpers';

jest.useFakeTimers();

describe('run-periodically', () => {
  describe('given a saga that executes faster than the period', () => {
    const periodInSeconds = arbitraryNumber(1, 100);
    const iterations = arbitraryNumber(2, 10);
    let counter: number;

    const saga: Saga = async () => {
      counter += 1;
    };

    beforeEach(async () => {
      counter = 0;
      runPeriodically(dummyLogger, saga, periodInSeconds);
      await jest.advanceTimersByTimeAsync(periodInSeconds * 1000 * iterations);
    });

    it('allows all iterations to run', () => {
      expect(counter).toBe(iterations);
    });
  });

  describe('given a saga that takes longer to run than the period', () => {
    const periodInSeconds = arbitraryNumber(1, 100);
    let counter: number;

    const saga: Saga = async () => {
      counter += 1;
      return new Promise((resolve) => {
        setTimeout(
          () => {
            resolve();
          },
          42 * periodInSeconds * 1000,
        );
      });
    };

    beforeEach(async () => {
      counter = 0;
      runPeriodically(dummyLogger, saga, periodInSeconds);
      await jest.advanceTimersByTimeAsync(2 * periodInSeconds * 1000);
    });

    it('prevents concurrent execution of the saga', () => {
      expect(counter).toBe(1);
    });
  });

  describe('given a saga that fails catastrophically', () => {
    it.todo('does not schedule the saga to be run again');
  });
});
