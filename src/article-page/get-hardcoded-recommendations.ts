import { URL } from 'url';
import { GetRecommendations } from './render-recommendations';

export type GetRecommendationContent = (url: URL) => Promise<string>;

export default (
  getRecommendationContent: GetRecommendationContent,
): GetRecommendations => (
  async (doi) => {
    if (doi.value === '10.1101/2020.06.03.20119925') {
      return [{
        content: await getRecommendationContent(new URL('https://doi.org/10.24072/pci.evolbiol.100107')),
      }];
    }
    return [];
  }
);
