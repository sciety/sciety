import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type ActionFailedPage = TE.TaskEither<RenderPageError, Page>;

export const actionFailedPageParamsCodec = t.type({
  errorType: tt.optionFromNullable(t.string),
});

type Params = t.TypeOf<typeof actionFailedPageParamsCodec>;

const generateErrorMessage = (errorType: O.Option<string>) => pipe(
  errorType,
  O.fold(
    () => 'Something unexpected happened; the action may have not completed. Please go back and try again.',
    () => 'Something new!',
  ),
  toHtmlFragment,
);

export const actionFailedPage = (params: Params): ActionFailedPage => TE.left(
  {
    type: DE.unavailable,
    message: generateErrorMessage(params.errorType),
  },
);
