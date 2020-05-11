import Doi from '../data/doi';
import communities from '../data/editorial-communities';
import { EditorialCommunityReviewedArticle } from '../types/editorial-community-reviewed-article';

export type FetchEditorialCommunityReviewedArticles = (communityId: string) =>
Promise<Array<EditorialCommunityReviewedArticle>>;

export default (): FetchEditorialCommunityReviewedArticles => {
  const communityArticles: Array<EditorialCommunityReviewedArticle> = [
    {
      doi: new Doi('10.1101/833392'),
      title: 'Uncovering the hidden antibiotic potential of Cannabis',
    },
    {
      doi: new Doi('10.1101/2020.03.22.002386'),
      title: 'A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing',
    },
  ];
  return async (communityId): Promise<Array<EditorialCommunityReviewedArticle>> => {
    if (communityId === communities[0].id) {
      return [communityArticles[0]];
    }
    return [communityArticles[1]];
  };
};
