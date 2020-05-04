import Doi from '../data/doi';

export interface Review {
  author: string;
  publicationDate: Date;
  summary: string;
  doi: Doi;
}
