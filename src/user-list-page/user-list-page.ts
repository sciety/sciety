import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { GetAllEvents, savedArticleDois } from './saved-articles/saved-article-dois';
import { Ports as SavedArticlePorts, savedArticles } from './saved-articles/saved-articles';
import { paginate } from '../shared-components/paginate';
import { paginationControls } from '../shared-components/pagination-controls';
import { supplementaryCard } from '../shared-components/supplementary-card';
import { supplementaryInfo } from '../shared-components/supplementary-info';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';
import { defaultUserListDescription } from '../user-page/static-messages';

export const paramsCodec = t.type({
  handle: t.string,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

type Params = t.TypeOf<typeof paramsCodec>;

type UserDetails = {
  avatarUrl: string,
  handle: string,
};

type Ports = SavedArticlePorts & {
  getAllEvents: GetAllEvents,
  getUserId: (handle: string) => TE.TaskEither<DE.DataError, UserId>,
  getUserDetails: (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>,
};

type UserListPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const supplementaryItems = [
  supplementaryCard(
    'What is a list?',
    toHtmlFragment(`
      <p>A list on Sciety is a collection of your own hand-picked articles, stored in one place for easy reference and sharing.</p>
      <a href="https://blog.sciety.org/lists-on-sciety/">Read more about lists</a>
    `),
  ),
];

const renderPageNumbers = (page: number, articleCount: number, numberOfPages: number) => (
  articleCount > 0
    ? `<p class="evaluated-articles__page_count">
        Showing page ${page} of ${numberOfPages}<span class="visually-hidden"> pages of list content</span>
      </p>`
    : ''
);

const render = (
  savedArticlesList: HtmlFragment,
  { handle, avatarUrl }: UserDetails,
  nextPage: O.Option<number>,
  page: number,
  articleCount: number,
  numberOfPages: number,
) => toHtmlFragment(`
  <header class="page-header page-header--user-list">
    <h1>
      Saved Articles
    </h1>
    <p class="page-header__subheading">
      <img src="${avatarUrl}" alt="" class="page-header__avatar">
      <span>A list by <a href="/users/${handle}">${handle}</a></span>
    </p>
    <p class="page-header__description">${defaultUserListDescription(`@${handle}`)}</p>
    ${handle === 'AvasthiReading' ? '<a class="user-list-subscribe" href="https://xag0lodamyw.typeform.com/to/OPBgQWgb">Subscribe</a>' : ''}
    ${handle === 'ZonaPellucida_' ? '<a class="user-list-subscribe" href="https://go.sciety.org/ZonaPellucida">Subscribe</a>' : ''}
  </header>
  <section>
    ${renderPageNumbers(page, articleCount, numberOfPages)}
    ${savedArticlesList}
    ${paginationControls(`/users/${handle}/lists/saved-articles?`, nextPage)}
  </section>
  ${supplementaryInfo(supplementaryItems)}
`);

export const userListPage = (ports: Ports): UserListPage => ({ handle, user, page }) => pipe(
  {
    userId: ports.getUserId(handle),
    events: TE.rightTask(ports.getAllEvents),
  },
  sequenceS(TE.ApplyPar),
  TE.chain(({ userId, events }) => pipe(
    {
      dois: TE.right(savedArticleDois(events)(userId)),
      userDetails: ports.getUserDetails(userId),
      listOwnerId: TE.right(userId),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.map((data) => pipe(
    data.dois,
    paginate(20, page),
    E.getOrElseW(() => ({ items: [], nextPage: O.none, numberOfPages: 1 })),
    (paginated) => ({ ...data, ...paginated, articleCount: data.dois.length }),
  )),
  TE.chainTaskK(({
    items, nextPage, userDetails, listOwnerId, articleCount, numberOfPages,
  }) => pipe(
    savedArticles(ports)(items, pipe(user, O.map((u) => u.id)), listOwnerId),
    T.map((content) => ({
      content,
      userDetails,
      nextPage,
      articleCount,
      numberOfPages,
    })),
  )),
  TE.bimap(
    (dataError) => ({
      type: dataError,
      message: toHtmlFragment('Page of paginated data, or user, not found.'),
    }),
    ({
      content, userDetails, nextPage, articleCount, numberOfPages,
    }) => ({
      title: `${handle} | Saved articles`,
      content: render(
        content,
        userDetails,
        nextPage,
        page,
        articleCount,
        numberOfPages,
      ),
    }),
  ),
);
