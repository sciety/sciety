import Doi from '../data/doi';
import { CommunityArticle } from '../types/community-article';

export type FetchCommunityArticles = () => Promise<Array<CommunityArticle>>;

export default (): FetchCommunityArticles => {
  const communityArticles: Array<CommunityArticle> = [
    {
      doi: new Doi('10.1101/833392'),
      title: 'Uncovering the hidden antibiotic potential of Cannabis',
    },
    {
      doi: new Doi('10.1101/2020.03.22.002386'),
      title: 'A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing',
    },
  ];
  return async (): Promise<Array<CommunityArticle>> => communityArticles;
};
