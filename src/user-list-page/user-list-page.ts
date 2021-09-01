import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetAllEvents, savedArticleDois } from './saved-articles/saved-article-dois';
import { Ports as SavedArticlePorts, savedArticles } from './saved-articles/saved-articles';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Params = {
  handle: string,
  user: O.Option<User>,
};

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

const supplementaryInfo = `
  <aside class="user-list-page-supplementary">
    <ul class="group-list" role="list">
      <li class="group-list__item">
        <article class="user-list-page-blog-card">
          <h2 class="user-list-page-blog-card__title">What is a list?</h2>
          <p> A list on Sciety is a collection of your own hand-picked articles, stored in one place for easy reference and sharing.</p>
          <a href="https://blog.sciety.org/lists-on-sciety/">Read more about lists</a>
        </article>
      </li>
    </ul>
  </aside>
`;

const render = (savedArticlesList: HtmlFragment, { handle, avatarUrl }: UserDetails) => toHtmlFragment(`
  <div class="sciety-grid-two-columns">
    <header class="page-header page-header--user-list">
      <h1>
        Saved Articles
      </h1>
      <p class="page-header__subheading">
        <img src="${avatarUrl}" alt="" class="page-header__avatar">
        <span>A list by <a href="/users/${handle}">${handle}</a></span>
      </p>
      <p class="page-header__description">Articles that have been saved by @${handle}, most recently saved first.</p>
      ${handle === 'AvasthiReading' ? '<a class="user-list-subscribe" href="https://xag0lodamyw.typeform.com/to/OPBgQWgb">Subscribe</a>' : ''}
      ${handle === 'kenton_swartz' ? '<a class="user-list-subscribe" href="https://xag0lodamyw.typeform.com/to/DxFgFs13">Subscribe</a>' : ''}
    </header>
    ${savedArticlesList}
    ${supplementaryInfo}
  </div>
`);

export const userListPage = (ports: Ports): UserListPage => ({ handle, user }) => pipe(
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
  TE.chainTaskK(({ dois, userDetails, listOwnerId }) => pipe(
    savedArticles(ports)(dois, pipe(user, O.map((u) => u.id)), listOwnerId),
    T.map((content) => ({
      content,
      userDetails,
    })),
  )),
  TE.bimap(
    (dataError) => ({
      type: dataError,
      message: toHtmlFragment('User not found.'),
    }),
    ({ content, userDetails }) => ({
      title: `${handle} | Saved articles`,
      content: render(content, userDetails),
    }),
  ),
);
