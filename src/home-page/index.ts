import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { Ports, yourFeed } from './your-feed';
import { Page } from '../types/page';
import { User } from '../types/user';

type Params = {
  user: O.Option<User>,
};

type HomePage = (params: Params) => T.Task<Page>;

export const homePage = (ports: Ports): HomePage => flow(
  (params) => params.user,
  O.map((user) => user.id),
  (userId) => ({
    header: T.of(renderPageHeader()),
    feed: yourFeed(ports)(userId),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
);
