import Doi from '../data/doi';

export interface FetchedArticle {
  title: string;
  doi: Doi;
  publicationDate: Date;
  abstract: string;
  authors: Array<string>;
}
