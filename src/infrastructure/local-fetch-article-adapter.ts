import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type LocalFetchArticleAdapter = (doi: Doi) => TE.TaskEither<DE.DataError, {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: Doi,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
}>;

export const localFetchArticleAdapter: LocalFetchArticleAdapter = (doi) => TE.right({
  abstract: sanitise(toHtmlFragment('')),
  authors: O.none,
  doi,
  title: sanitise(toHtmlFragment('')),
  server: 'biorxiv' as const,
});
