import createHardCodedEndorsingEditorialCommunities, { GetNameForEditorialCommunity } from '../../src/article-search-page/hard-coded-endorsing-editorial-communities';
import Doi from '../../src/data/doi';
import shouldNotBeCalled from '../should-not-be-called';

describe('hard-coded-endorsing-editorial-communities adapter', () => {
  describe('articles with no endorsements', () => {
    it('returns an empty list', async () => {
      const adapter = createHardCodedEndorsingEditorialCommunities(shouldNotBeCalled);

      expect(await adapter(new Doi('10.1111/12345678'))).toHaveLength(0);
    });
  });

  describe('articles with endorsements', () => {
    it('returns the names of the editorial communities', async () => {
      const getNameForEditorialCommunity: GetNameForEditorialCommunity = () => 'Journal of Psychoceramics';
      const adapter = createHardCodedEndorsingEditorialCommunities(getNameForEditorialCommunity);

      expect(await adapter(new Doi('10.1101/209320'))).toStrictEqual(['Journal of Psychoceramics']);
    });
  });
});
