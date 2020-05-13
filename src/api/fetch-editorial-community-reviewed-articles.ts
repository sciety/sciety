import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { EditorialCommunityReviewedArticle } from '../types/editorial-community-reviewed-article';

export type FetchEditorialCommunityReviewedArticles = (communityId: string) =>
Promise<Array<EditorialCommunityReviewedArticle>>;

export default (editorialCommunities: EditorialCommunityRepository): FetchEditorialCommunityReviewedArticles => {
  const editorialCommunityReviewedArticles: Array<EditorialCommunityReviewedArticle> = [
    {
      doi: new Doi('10.1101/833392'),
      title: 'Uncovering the hidden antibiotic potential of Cannabis',
    },
    {
      doi: new Doi('10.1101/2020.03.22.002386'),
      title: 'A SARS-CoV-2-Human Protein-Protein Interaction Map Reveals Drug Targets and Potential Drug-Repurposing',
    },
  ];
  return async (editorialCommunityId): Promise<Array<EditorialCommunityReviewedArticle>> => {
    if (editorialCommunityId === editorialCommunities.all()[0].id) {
      return [editorialCommunityReviewedArticles[0]];
    }
    return [editorialCommunityReviewedArticles[1]];
  };
};
