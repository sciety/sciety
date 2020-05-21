import Doi from '../../data/doi';

export interface ArticleViewModel {
  title: string;
  doi: Doi;
  publicationDate: Date;
  abstract: string;
  authors: Array<string>;
}

export interface ReviewViewModel {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export interface ArticlePageViewModel {
  article: ArticleViewModel;
  reviews: Array<ReviewViewModel>;
}
