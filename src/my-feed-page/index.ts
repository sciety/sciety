import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { Ports, yourFeed } from './your-feed';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { User } from '../types/user';

export const myFeedParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

type HomePage = (user: O.Option<User>) => T.Task<Page>;

const callToAction = toHtmlFragment('<p class="my-feed-page-cta"><a href="/log-in">Log in with Twitter</a> to follow your favourite Sciety groups and see what they have evaluated.</p>');

export const myFeedPage = (ports: Ports): HomePage => flow(
  (user) => ({
    header: T.of(renderPageHeader()),
    content: pipe(
      user,
      O.fold(
        () => T.of(callToAction),
        ({ id }) => yourFeed(ports)(id),
      ),
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
);
