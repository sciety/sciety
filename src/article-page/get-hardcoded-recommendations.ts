import { URL } from 'url';
import { GetEndorsements } from './render-endorsements';

export type GetRecommendationContent = (url: URL) => Promise<string>;

export default (
  getRecommendationContent: GetRecommendationContent,
): GetEndorsements => (
  async (doi) => {
    if (doi.value === '10.1101/2020.06.03.20119925') {
      return [{
        title: 'SARS-Cov-2 genome sequence analysis suggests rapid spread followed by epidemic slowdown in France',
        content: await getRecommendationContent(new URL('https://doi.org/10.24072/pci.evolbiol.100107')),
      }];
    }
    return [];
  }
);
