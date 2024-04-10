import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { myFeed, Dependencies } from './my-feed';
import { renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { userIdCodec } from '../../types/user-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../html-page';
import { queryStringParameters } from '../../standards';

export const myFeedParams = t.type({
  [queryStringParameters.page]: queryStringParameters.pageCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

type Params = t.TypeOf<typeof myFeedParams>;

type HomePage = (params: Params) => TE.TaskEither<never, HtmlPage>;

const callToAction = toHtmlFragment('<p><a href="/log-in">Log in</a> to follow your favourite Sciety groups and see what they have evaluated.</p>');

export const myFeedPage = (dependencies: Dependencies): HomePage => (params: Params) => pipe(
  {
    header: T.of(renderPageHeader()),
    content: pipe(
      params.user,
      O.fold(
        () => T.of(callToAction),
        ({ id }) => myFeed(dependencies)(id, 20, params.page),
      ),
    ),
  },
  sequenceS(T.ApplyPar),
  T.map(renderPage),
  TE.rightTask,
);
