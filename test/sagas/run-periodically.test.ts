describe('run-periodically', () => {
  describe('given a saga that executes faster than the period', () => {
    it.todo('allows all iterations to run');
  });

  describe('given a saga that takes longer to run than the period', () => {
    it.todo('prevents concurrent execution of the saga');
  });
});
