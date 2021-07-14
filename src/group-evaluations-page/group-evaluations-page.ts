import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type GroupEvaluationsPage = () => TE.TaskEither<RenderPageError, Page>;

export const groupEvaluationsPage = (): GroupEvaluationsPage => () => pipe(
  TE.right({
    title: '',
    content: toHtmlFragment(''),
  }),
);
