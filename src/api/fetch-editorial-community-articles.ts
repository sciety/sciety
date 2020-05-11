import Doi from '../data/doi';
import communities from '../data/editorial-communities';
import { EditorialCommunityArticle } from '../types/editorial-community-article';

export type FetchEditorialCommunityArticles = (communityId: string) => Promise<Array<EditorialCommunityArticle>>;

export default (): FetchEditorialCommunityArticles => {
  const communityArticles: Array<EditorialCommunityArticle> = [
    {
      doi: new Doi('10.1101/833392'),
      title: 'Uncovering the hidden antibiotic potential of Cannabis',
    },
    {
      doi: new Doi('10.1101/2020.03.22.002386'),
      title: 'A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing',
    },
  ];
  return async (communityId): Promise<Array<EditorialCommunityArticle>> => {
    if (communityId === communities[0].id) {
      return [communityArticles[0]];
    }
    return [communityArticles[1]];
  };
};
