import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import Doi from './doi';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type FetchExternalArticle = (doi: Doi) => T.Task<Result<{
  abstract: SanitisedHtmlFragment;
  authors: Array<string>;
  doi: Doi;
  title: SanitisedHtmlFragment;
  publicationDate: Date;
}, 'not-found' | 'unavailable'>>;
