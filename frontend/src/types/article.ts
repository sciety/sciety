import Doi from '../data/doi';

export interface Article {
  title: string;
  type: string;
  doi: Doi;
  publicationDate: Date;
  abstract: string;
  authors: string[];
}
