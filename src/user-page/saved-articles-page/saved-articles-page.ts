import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { renderHeader, UserDetails } from '../render-header';
import { renderErrorPage } from '../render-page';
import { savedArticles, Ports as SavedArticlesPorts } from '../saved-articles';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = SavedArticlesPorts & {
  getUserDetails: GetUserDetails,
};

type Params = {
  id: UserId,
};

type SavedArticlesPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Tabs = {
  userId: UserId,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

const tabsWithGroupsActive = (tabs: Tabs) => `
  <a href="/users/${tabs.userId}/saved-articles" class="user-page-tab user-page-tab--link" aria-label="Discover matching articles (${tabs.availableArticleMatches} search results)">Saved articles (${tabs.availableArticleMatches})</a>
  <h3 class="user-page-tab user-page-tab--heading"><span class="visually-hidden">Currently showing </span>Groups (${tabs.availableGroupMatches}<span class="visually-hidden"> search results</span>)</h3>
`;

const tabsWithArticlesActive = (tabs: Tabs) => `
  <h3 class="user-page-tab user-page-tab--heading"><span class="visually-hidden">Currently showing </span>Saved articles (${tabs.availableArticleMatches}<span class="visually-hidden"> search results</span>)</h3>
  <a href="/users/${tabs.userId}" class="user-page-tab user-page-tab--link" aria-label="Discover matching groups (${tabs.availableGroupMatches} search results)">Groups (${tabs.availableGroupMatches}<span class="visually-hidden"> search results</span>)</a>
`;

const categoryTabs = (tabs: Tabs) => `
  <h2 class="visually-hidden">Search result categories</h2>
  <div class="user-page-tabs-container">
    ${tabs.category === 'groups' ? tabsWithGroupsActive(tabs) : tabsWithArticlesActive(tabs)}
  </div>
`;

export const savedArticlesPage = (ports: Ports): SavedArticlesPage => (params) => pipe(
  {
    header: pipe(
      ports.getUserDetails(params.id),
      TE.map(renderHeader),
    ),
    savedArticles: savedArticles(ports)(params.id),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(
    renderErrorPage,
    (components) => ({
      title: 'User\'s saved articles',
      content: toHtmlFragment(`
        <div class="page-content__background">
          <article class="sciety-grid sciety-grid--user">
            ${components.header}

            ${categoryTabs({
        userId: params.id,
        availableArticleMatches: 0,
        availableGroupMatches: 0,
        category: 'saved-articles',
      })}
            <div class="main-content main-content--user">
              ${components.savedArticles}
            </div>

          </article>
        </div>
      `),
    }),
  ),
);
