describe('add-article-to-elife-medicine-list', () => {
  describe('when an EvaluationRecorded event by eLife is received', () => {
    describe('and the subject area belongs to the Medicine list', () => {
      it.todo('calls the AddArticleToList command');
    });

    describe('and the subject area does not belong to the Medicine list', () => {
      it.todo('does not call the AddArticleToList command');
    });

    describe('and subject area cannot be retrieved', () => {
      it.todo('does not call the AddArticleToList command');

      it.todo('logs an error');
    });
  });

  describe('when an EvaluationRecorded event by another group is received', () => {
    it.todo('does not call the AddArticleToList command');
  });

  describe('when any other event is received', () => {
    it.todo('does not call the AddArticleToList command');
  });
});
