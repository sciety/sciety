import { getUserListDetails } from '../../../src/user-page/user-list-card/get-user-list-details';

describe('get-user-list-details', () => {
  describe('when the list contains no articles', () => {
    it('returns a count of 0', () => {
      const details = getUserListDetails();

      expect(details.articleCount).toStrictEqual(0);
    });

    it.todo('returns no last updated date');
  });

  describe('when the list contains some articles', () => {
    it.todo('returns a count of the articles');

    it.todo('returns the last updated date');
  });

  describe('when only a different user has saved articles', () => {
    it.todo('returns a count of 0');

    it.todo('returns no last updated date');
  });
});
