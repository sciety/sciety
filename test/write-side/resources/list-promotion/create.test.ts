describe('create', () => {
  describe('when given the id of a list that the group has never before promoted', () => {
    it.todo('raises exactly one ListPromotionCreated event');
  });

  describe('when given the id of a list that the group has already promoted', () => {
    it.todo('raises no events');
  });

  describe('when given the id of a list that a different group has already promoted', () => {
    it.todo('raises exactly one ListPromotionCreated event');
  });

  describe('when the group has already promoted a different list', () => {
    it.todo('raises exactly one ListPromotionCreated event');
  });
});
