import { runPeriodically } from '../../src/sagas/run-periodically';
import { Saga } from '../../src/sagas/saga';
import { dummyLogger } from '../dummy-logger';
import { arbitraryNumber } from '../helpers';

jest.useFakeTimers();

describe('run-periodically', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

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

  describe('given a saga that fails catastrophically on its first run', () => {
    const periodInSeconds = arbitraryNumber(1, 100);
    let counter: number;

    const saga: Saga = async () => {
      counter += 1;
      throw new Error('Intentionally failing saga');
    };

    beforeEach(async () => {
      counter = 0;
      runPeriodically(dummyLogger, saga, periodInSeconds);
      await jest.advanceTimersByTimeAsync(2 * periodInSeconds * 1000);
    });

    it('runs the saga only once', () => {
      expect(counter).toBe(1);
    });

    it('does not schedule the saga to be run again', () => {
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
