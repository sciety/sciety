import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { renderTweetThis } from './render-tweet-this';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

type ArticleDetails = {
  title: SanitisedHtmlFragment;
  authors: Array<string>;
};

export type GetArticleDetails<Err> = (doi: Doi) => TE.TaskEither<Err, ArticleDetails>;

export type RenderPageHeader<Err> = (doi: Doi, userId: O.Option<UserId>) => TE.TaskEither<Err, HtmlFragment>;

type RenderSavedLink = (doi: Doi, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

const renderSaveForm = (doi: Doi): HtmlFragment => {
  let saveForm = '';
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    saveForm = `
      <form class="save-article-form">
        <input type="hidden" name="articleid" value="${doi.value}">
        <button type="submit" class="save-article-button">
          <img class="save-article-button__icon" src="/static/images/playlist_add-24px.svg" alt=""> Save to my list
        </button>
      </form>
    `;
  }
  return toHtmlFragment(saveForm);
};

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
      ${renderSaveForm(doi)}
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
  TE.chain(flow(
    render(renderSavedLink)(doi, userId),
    (rendered) => TE.rightTask<Err, HtmlFragment>(rendered),
  )),
);
