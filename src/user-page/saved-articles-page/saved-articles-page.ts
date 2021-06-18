import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { savedArticles, Ports as SavedArticlesPorts } from './saved-articles';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { UserId } from '../../types/user-id';
import { renderErrorPage } from '../render-error-page';
import { renderHeader, UserDetails } from '../render-header';

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
  <a href="/users/${tabs.userId}/saved-articles" class="user-page-tab user-page-tab--link">Saved articles </a>
  <h3 class="user-page-tab user-page-tab--heading"><span class="visually-hidden">Currently showing </span>Followed groups</h3>
`;

const tabsWithArticlesActive = (tabs: Tabs) => `
  <h3 class="user-page-tab user-page-tab--heading"><span class="visually-hidden">Currently showing </span>Saved articles</h3>
  <a href="/users/${tabs.userId}/followed-groups" class="user-page-tab user-page-tab--link">Followed groups</a>
`;

const categoryTabs = (tabs: Tabs) => `
  <h2 class="visually-hidden">Things this user finds useful</h2>
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
    tabs: TE.right(categoryTabs({
      userId: params.id,
      availableArticleMatches: 0,
      availableGroupMatches: 0,
      category: 'saved-articles',
    })),
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

            <ul role="tablist">
              <li role="presentation">
                <a role="tab" href="#content" id="active-tab" aria-selected="true">Saved articles</a>
              </li>
              <li role="presentation">
                <a role="tab" href="/users/${params.id}/followed-groups">Followed groups</a>
              </li>
            </ul>
            <section role="tabpanel" id="content" aria-labelledby="active-tab">
              <div class="main-content main-content--user">
                ${components.savedArticles}
              </div>
            </section>

          </article>
        </div>
      `),
    }),
  ),
);
