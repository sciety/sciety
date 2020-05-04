import Doi from '../data/doi';

export interface ArticleTeaser {
  doi: Doi;
  title: string;
  authors: Array<string>;
  numberOfReviews: number;
}
