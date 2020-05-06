import Doi from '../data/doi';

export interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
}
