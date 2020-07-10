import { Result } from 'true-myth';
import Doi from './doi';

export type FetchExternalArticle = (doi: Doi) => Promise<Result<{
  abstract: string;
  authors: Array<string>;
  doi: Doi;
  title: string;
  publicationDate: Date;
}, 'not-found' | 'unavailable'>>;
