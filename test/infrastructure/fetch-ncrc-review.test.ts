import { constructFoundReview } from '../../src/infrastructure/fetch-ncrc-review';

describe('fetch-ncrc-review', () => {
  describe('construct-ncrc-review', () => {
    it('builds a url from a title', () => {
      const backendReview = {
        title: 'Foo Bar',
        ourTake: 'Pretty good',
      };
      const result = constructFoundReview(backendReview);

      expect(result.url.toString()).toStrictEqual('https://ncrc.jhsph.edu/research/foo-bar/');
    });

    it.todo('hardcodes a text');
  });
});
