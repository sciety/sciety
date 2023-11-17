import { constructNcrcReview } from '../../../src/third-parties/ncrc/construct-ncrc-review.js';

describe('fetch-ncrc-review', () => {
  describe('construct-found-review', () => {
    it('builds a url from a title', () => {
      const ncrcReview = {
        title: 'Foo Bar',
        ourTake: 'Pretty good',
        limitations: '',
        mainFindings: '',
        studyDesign: '',
        studyPopulationSetting: '',
        studyStrength: '',
        valueAdded: '',
      };
      const result = constructNcrcReview(ncrcReview);

      expect(result.url.toString()).toBe('https://ncrc.jhsph.edu/research/foo-bar/');
    });
  });
});
