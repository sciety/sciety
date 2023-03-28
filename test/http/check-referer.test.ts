describe('check-referer', () => {
  describe('when a referer is not provided', () => {
    it.todo('defaults to homepage');
  });

  describe('when a referer is provided', () => {
    describe('and it matches the application hostname', () => {
      it.todo('uses the provided referer');
    });

    describe('and it does not match the application hostname', () => {
      it.todo('defaults to the homepage');
    });
  });
});
