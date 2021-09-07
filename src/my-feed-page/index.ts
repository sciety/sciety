import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { myFeed, Ports } from './my-feed';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const myFeedParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

type Params = t.TypeOf<typeof myFeedParams>;

type HomePage = (params: Params) => TE.TaskEither<never, Page>;

const callToAction = toHtmlFragment('<p class="my-feed-page-cta"><a href="/log-in">Log in with Twitter</a> to follow your favourite Sciety groups and see what they have evaluated.</p>');

export const myFeedPage = (ports: Ports): HomePage => flow(
  ({ user }) => ({
    header: T.of(renderPageHeader()),
    content: pipe(
      user,
      O.fold(
        () => T.of(callToAction),
        ({ id }) => myFeed(ports)(id),
      ),
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map(renderPage),
  TE.rightTask,
);
