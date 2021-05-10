import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { Ports, yourFeed } from './your-feed';
import { Page } from '../types/page';
import { UserId } from '../types/user-id';

type Params = {
  userId: UserId,
};

type HomePage = (params: Params) => T.Task<Page>;

export const loggedInHomePage = (ports: Ports): HomePage => flow(
  ({ userId }) => ({
    header: T.of(renderPageHeader()),
    feed: yourFeed(ports)(userId),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
);
