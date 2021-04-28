describe('followed-groups', () => {
  describe('there are no follow events', () => {
    it.todo('returns an empty array');
  });

  describe('there is a single follow event for the user', () => {
    it.todo('returns the group id');
  });

  describe('there is a single follow event and a single unfollow event for the user', () => {
    it.todo('returns an empty array');
  });

  describe('there are 4 follow events for different groups for the user', () => {
    it.todo('returns the group ids');
  });

  describe('there are 4 follow events and 2 unfollow events for the user', () => {
    it.todo('returns the group ids of the still followed groups');
  });

  describe('there is only a follow event for another user', () => {
    it.todo('returns an empty array');
  });

  describe('there is a single follow event for the user, and a follow and unfollow event for another user', () => {
    it.todo('returns an empty array');
  });
});
