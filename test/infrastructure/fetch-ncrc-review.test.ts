import { constructNcrcReview } from '../../src/infrastructure/fetch-ncrc-review';

describe('fetch-ncrc-review', () => {
  describe('construct-ncrc-review', () => {
    it('builds a url from a title', () => {
      const backendReview = {
        title: 'Foo Bar',
      };
      const result = constructNcrcReview(backendReview);

      expect(result.url.toString()).toStrictEqual('https://ncrc.jhsph.edu/research/foo-bar/');
    });

    it.todo('hardcodes a text');
  });
});
