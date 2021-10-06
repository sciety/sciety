describe('generate-docmaps', () => {
  describe('when the article hasn\'t been reviewed', () => {
    it.todo('returns an empty array');
  });

  describe('when the article has been reviewed only by unsupported groups', () => {
    it.todo('returns an empty array');
  });

  describe('when the article has been reviewed by one supported group', () => {
    it.todo('returns an array containing one docmap');
  });

  describe('when the article has been reviewed by two supported groups', () => {
    it.todo('returns an array containing a docmap for each group');
  });

  describe('when both docmaps fail', () => {
    it.todo('returns a 500 http status code');

    it.todo('returns a message containing all the groups whose docmaps failed');
  });

  describe('when one docmap fails', () => {
    it.todo('returns a 500 http status code');

    it.todo('returns a message containing the group whose docmap failed');
  });
});
