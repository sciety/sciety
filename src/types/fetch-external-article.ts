import { Result } from 'true-myth';
import Doi from './doi';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type FetchExternalArticle = (doi: Doi) => Promise<Result<{
  abstract: SanitisedHtmlFragment;
  authors: Array<string>;
  doi: Doi;
  title: SanitisedHtmlFragment;
  publicationDate: Date;
}, 'not-found' | 'unavailable'>>;
