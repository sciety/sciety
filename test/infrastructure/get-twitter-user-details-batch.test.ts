describe('get-twitter-user-details-batch', () => {
  describe('when given no user ids', () => {
    it.todo('does not call Twitter');

    it.todo('returns an empty array');
  });

  describe('when given one or more user ids', () => {
    it.todo('returns details for each user id');

    it.todo('returns details in the same order as that supplied');

    it.todo('asks Twitter for the user\'s avatarUrl, displayName, and handle');
  });

  describe('if at least one Twitter user does not exist', () => {
    it.todo('returns notFound');
  });

  describe('if at least one Twitter user ID is invalid', () => {
    it.todo('returns notFound');
  });

  describe('if the Twitter API is unavailable', () => {
    it.todo('returns unavailable');
  });

  describe('if we cannot understand the Twitter response', () => {
    it.todo('returns unavailable');
  });

  describe('if we cannot generate userDetails for each user ID', () => {
    it.todo('returns unavailable');
  });
});
