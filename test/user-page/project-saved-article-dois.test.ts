import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';
import { projectSavedArticleDois } from '../../src/user-page/project-saved-article-dois';

describe('project-saved-article-dois', () => {
  describe('when the user has saved articles', () => {
    it('returns the DOIs of the saved articles', () => {
      const expected = [
        new Doi('10.1101/2020.07.04.187583'),
        new Doi('10.1101/2020.09.09.289785'),
      ];

      const output = projectSavedArticleDois(toUserId('1295307136415735808'));

      expect(output).toStrictEqual(expected);
    });
  });

  describe('when the user has not saved articles', () => {
    it('returns an empty array', () => {
      const output = projectSavedArticleDois(toUserId('some-user'));

      expect(output).toHaveLength(0);
    });
  });
});
