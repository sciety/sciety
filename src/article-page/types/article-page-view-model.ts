import Doi from '../../data/doi';

export interface ReviewViewModel {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export interface ArticlePageViewModel {
  reviews: Array<ReviewViewModel>;
}
