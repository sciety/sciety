import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Params } from './params';
import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';

type GroupPage = (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (params) => pipe(
  params,
  constructViewModel,
  E.mapLeft(() => (toErrorPageBodyViewModel({ type: DE.unavailable, message: toHtmlFragment('You are not authorised to proceed.') }))),
  E.map(() => toHtmlPage({ title: 'Manage details', content: toHtmlFragment('') })),
  T.of,
);
