import { constructFoundReview, NcrcReview } from '../../src/infrastructure/fetch-ncrc-review';

describe('fetch-ncrc-review', () => {
  describe('construct-ncrc-review', () => {
    it('builds a url from a title', () => {
      const ncrcReview: NcrcReview = {
        title: 'Foo Bar',
        ourTake: 'Pretty good',
        limitations: '',
        mainFindings: '',
        studyDesign: '',
        studyPopulationSetting: '',
        studyStrength: '',
        valueAdded: '',
      };
      const result = constructFoundReview(ncrcReview);

      expect(result.url.toString()).toStrictEqual('https://ncrc.jhsph.edu/research/foo-bar/');
    });

    it.todo('hardcodes a text');
  });
});
