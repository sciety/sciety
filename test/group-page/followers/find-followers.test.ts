describe('find-followers', () => {
  describe('when no users have followed the group', () => {
    it.todo('return empty list');
  });

  describe('when 1 user has followed the group', () => {
    it.todo('returns a list containing them as a follower');

    it.todo('their followedGroupCount is 1');

    it.todo('their listCount is 1');
  });

  describe('when 1 user has followed then unfollowed the group', () => {
    it.todo('return empty list');
  });

  describe('when 1 user has followed the group and another group', () => {
    it.todo('returns a list containing them as a follower');

    it.todo('their followedGroupCount is 2');
  });

  describe('when multiple users have followed the group', () => {
    it.todo('returns a list containing them as followers');

    it.todo('the list is ordered with most recently followed first');
  });
});
