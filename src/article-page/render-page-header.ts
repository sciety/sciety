import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

type ArticleDetails = {
  title: SanitisedHtmlFragment;
  authors: Array<string>;
};

export type GetArticleDetails<Err> = (doi: Doi) => TE.TaskEither<Err, ArticleDetails>;

export type RenderPageHeader<Err> = (doi: Doi, userId: O.Option<UserId>) => TE.TaskEither<Err, HtmlFragment>;

type RenderTweetThis = (doi: Doi) => HtmlFragment;
type RenderSaveArticle = (doi: Doi, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

const render = (
  renderTweetThis: RenderTweetThis,
  renderSaveArticle: RenderSaveArticle,
) => (doi: Doi, userId: O.Option<UserId>) => (details: ArticleDetails): T.Task<HtmlFragment> => pipe(
  renderSaveArticle(doi, userId),
  T.map((renderedSaveArticle) => `
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
      ${renderedSaveArticle}
    </div>
  </header>
  `),
  T.map(toHtmlFragment),
);

export const createRenderPageHeader = <Err>(
  getArticleDetails: GetArticleDetails<Err>,
  renderTweetThis: RenderTweetThis,
  renderSaveArticle: RenderSaveArticle,
): RenderPageHeader<Err> => (doi, userId) => pipe(
    doi,
    getArticleDetails,
    TE.chain(flow(
      render(renderTweetThis, renderSaveArticle)(doi, userId),
      (rendered) => TE.rightTask<Err, HtmlFragment>(rendered),
    )),
  );
