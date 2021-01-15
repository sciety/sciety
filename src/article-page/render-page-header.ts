import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { constant, identity, pipe } from 'fp-ts/lib/function';
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

const templateSavedLink = (userId: UserId): string => `
  <a class="saved-to-list" href="/users/${userId}">
    <img src="/static/images/playlist_add_check-24px.svg" alt="" class="saved-to-list__icon">
    Saved to list
  </a>
`;

type RenderSavedLink = (doi: Doi, userId: O.Option<UserId>) => string;

// TODO: inject renderTweetThis and similar
const render = (renderSavedLink: RenderSavedLink) => (doi: Doi, userId: O.Option<UserId>) => (details: ArticleDetails): HtmlFragment => toHtmlFragment(`
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
      ${renderSavedLink(doi, userId)}
    </div>
  </header>
`);

export default <E>(
  getArticleDetails: GetArticleDetails<E>,
): RenderPageHeader<E> => (doi, userId) => {
  const renderSavedLink: RenderSavedLink = () => {
    const savedDois = ['10.1101/2020.07.04.187583', '10.1101/2020.09.09.289785'];

    return pipe(
      userId,
      O.filter((u) => u === '1295307136415735808'),
      O.filter(() => savedDois.includes(doi.value)),
      O.map(templateSavedLink),
      O.fold(
        constant(''),
        identity,
      ),
    );
  };

  return pipe(
    doi,
    getArticleDetails,
    T.map((article) => article.map(render(renderSavedLink)(doi, userId))),
  );
};
