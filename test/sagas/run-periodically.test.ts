import { runPeriodically, Saga } from '../../src/sagas/run-periodically';
import { dummyLogger } from '../dummy-logger';

describe('run-periodically', () => {
  describe('given a saga that executes faster than the period', () => {
    const periodMs = 1000;
    const iterations = 2;
    const fudgeFactorMs = 100;
    let counter: number;

    const saga: Saga = async () => {
      counter += 1;
    };

    beforeEach(async () => {
      jest.useFakeTimers();
      counter = 0;
      runPeriodically(dummyLogger, saga, periodMs / 1000);
      await jest.advanceTimersByTimeAsync(periodMs * iterations + fudgeFactorMs);
    });

    it('allows all iterations to run', () => {
      expect(counter).toBe(iterations);
    });
  });

  describe('given a saga that takes longer to run than the period', () => {
    it.todo('prevents concurrent execution of the saga');
  });
});
