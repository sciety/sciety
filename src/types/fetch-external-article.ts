import { Result } from 'true-myth';
import Doi from './doi';
import { HtmlFragment } from './html-fragment';

export type FetchExternalArticle = (doi: Doi) => Promise<Result<{
  abstract: string;
  authors: Array<string>;
  doi: Doi;
  title: HtmlFragment;
  publicationDate: Date;
}, 'not-found' | 'unavailable'>>;
