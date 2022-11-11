import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { renderPage } from './render-page';
import { GetAllEvents, savedArticleDois } from './saved-articles/saved-article-dois';
import { Ports as SavedArticlePorts, savedArticles } from './saved-articles/saved-articles';
import { paginate } from '../shared-components/paginate';
import { paginationControls } from '../shared-components/pagination-controls';
import { supplementaryCard } from '../shared-components/supplementary-card';
import { supplementaryInfo } from '../shared-components/supplementary-info';
import { GetUserDetails, UserDetails } from '../shared-ports/get-user-details';
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

type Ports = SavedArticlePorts & {
  getAllEvents: GetAllEvents,
  getUserId: (handle: string) => TE.TaskEither<DE.DataError, UserId>,
  getUserDetails: GetUserDetails,
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
    ? `<p class="articles-page-count">
        Showing page <b>${page}</b> of <b>${numberOfPages}</b><span class="visually-hidden"> pages of list content</span>
      </p>`
    : ''
);

type HeaderViewModel = {
  avatarUrl: string,
  name: string,
  description: string,
  ownerName: string,
  ownerHref: string,
  subscribeHref: O.Option<string>,
};

const renderHeader = ({
  avatarUrl, name, description, ownerName, ownerHref, subscribeHref,
}: HeaderViewModel) => toHtmlFragment(`
  <header class="page-header page-header--user-list">
    <h1>
      ${name}
    </h1>
    <p class="page-header__subheading">
      <img src="${avatarUrl}" alt="" class="page-header__avatar">
      <span>A list by <a href="${ownerHref}">${ownerName}</a></span>
    </p>
    <p class="page-header__description">${description}</p>
    ${pipe(
    subscribeHref,
    O.fold(
      () => '',
      (href) => `<a class="user-list-subscribe" href="${href}">Subscribe<span class="visually-hidden"> to this list</span></a>`,
    ),
  )}
  </header>
`);

const toHeaderViewModel = ({ avatarUrl, handle }: UserDetails) => ({
  avatarUrl,

  name: handle === 'BiophysicsColab' ? 'Reading list' : 'Saved Articles',
  description: handle === 'BiophysicsColab'
    ? 'Articles that are being read by Biophysics Colab.'
    : defaultUserListDescription(`@${handle}`),
  ownerName: handle === 'BiophysicsColab' ? 'Biophysics Colab' : handle,
  ownerHref: handle === 'BiophysicsColab' ? '/groups/biophysics-colab/about' : `/users/${handle}`,

  subscribeHref: pipe(
    {
      AvasthiReading: 'https://xag0lodamyw.typeform.com/to/OPBgQWgb',
      ZonaPellucida_: 'https://go.sciety.org/ZonaPellucida',
    },
    R.lookup(handle),
  ),
});

const renderContent = (
  content: HtmlFragment,
  handle: string,
  nextPage: O.Option<number>,
  page: number,
  articleCount: number,
  numberOfPages: number,
) => toHtmlFragment(`
  ${renderPageNumbers(page, articleCount, numberOfPages)}
  ${content}
  ${paginationControls(`/users/${handle}/lists/saved-articles?`, nextPage)}
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
      title: `${handle} | Saved articles`,
      header: pipe(
        userDetails,
        toHeaderViewModel,
        renderHeader,
      ),
      content: renderContent(
        content,
        handle,
        nextPage,
        page,
        articleCount,
        numberOfPages,
      ),
      supplementary: supplementaryInfo(supplementaryItems),
    })),
  )),
  TE.bimap(
    (dataError) => ({
      type: dataError,
      message: toHtmlFragment('Page of paginated data, or user, not found.'),
    }),
    renderPage,
  ),
);
