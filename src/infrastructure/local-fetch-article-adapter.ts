import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { FetchArticle } from '../shared-ports';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise } from '../types/sanitised-html-fragment';

export const localFetchArticleAdapter: FetchArticle = (doi) => TE.right({
  abstract: sanitise(toHtmlFragment('')),
  authors: O.none,
  doi,
  title: sanitise(toHtmlFragment('')),
  server: 'biorxiv' as const,
});
