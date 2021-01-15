import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { renderTweetThis } from './render-tweet-this';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

interface ArticleDetails {
  title: SanitisedHtmlFragment;
  authors: Array<string>;
}

export type GetArticleDetails<E> = (doi: Doi) => T.Task<Result<ArticleDetails, E>>;

export type RenderPageHeader<E> = (doi: Doi, userId: O.Option<UserId>) => T.Task<Result<HtmlFragment, E>>;

type RenderSavedLink = (doi: Doi, userId: O.Option<UserId>) => T.Task<string>;

// TODO: inject renderTweetThis and similar
const render = (
  renderSavedLink: RenderSavedLink,
) => (doi: Doi, userId: O.Option<UserId>) => (details: ArticleDetails): T.Task<HtmlFragment> => pipe(
  renderSavedLink(doi, userId),
  T.map((renderedSavedLink) => `
  <header class="page-header page-header--article">
    <h1>${details.title}</h1>
    <ol aria-label="Authors of this article" class="article-author-list" role="list">
      ${details.authors.map((author) => `<li>${author}</li>`).join('')}
    </ol>
    <ul aria-label="Publication details" class="article-meta-data-list" role="list">
      <li>
        <a href="https://doi.org/${doi.value}">https://doi.org/${doi.value}</a>
      </li>
    </ul>
    <div class="article-actions">
      ${renderTweetThis(doi)}
      ${renderedSavedLink}
    </div>
  </header>
  `),
  T.map(toHtmlFragment),
);

export default <Err>(
  getArticleDetails: GetArticleDetails<Err>,
  renderSavedLink: RenderSavedLink,
): RenderPageHeader<Err> => (doi, userId) => pipe(
  doi,
  getArticleDetails,
  T.map((result) => result.mapOrElse(
    (error) => E.left<Err, ArticleDetails>(error),
    (success) => E.right<Err, ArticleDetails >(success),
  )),
  TE.chain(flow(
    render(renderSavedLink)(doi, userId),
    (rendered) => TE.rightTask<Err, HtmlFragment>(rendered),
  )),
  T.map(E.fold(
    (error) => Result.err<HtmlFragment, Err>(error),
    (success) => Result.ok<HtmlFragment, Err>(success),
  )),
);
