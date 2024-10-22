import { runPeriodically, Saga } from '../../src/sagas/run-periodically';

describe('run-periodically', () => {
  describe.skip('given a saga that is cancelled immediately', () => {
    let counter: number;
    const saga: Saga = async () => {
      counter += 1;
    };

    beforeEach(() => {
      counter = 0;
      const sagaTimer = runPeriodically(saga, 1);
      sagaTimer.cancel();
    });

    it('runs no iterations', () => {
      expect(counter).toBe(0);
    });
  });

  describe('given a saga that executes faster than the period', () => {
    it.todo('allows all iterations to run');
  });

  describe('given a saga that takes longer to run than the period', () => {
    it.todo('prevents concurrent execution of the saga');
  });
});
