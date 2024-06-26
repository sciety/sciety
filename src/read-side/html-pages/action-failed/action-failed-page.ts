import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ErrorPageViewModel, toErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

type ActionFailedPage = TE.TaskEither<ErrorPageViewModel, HtmlPage>;

const actionFailedErrorTypeCodec = t.literal('codec-failed');

export const actionFailedPageParamsCodec = t.type({
  errorType: tt.optionFromNullable(actionFailedErrorTypeCodec),
});

type Params = t.TypeOf<typeof actionFailedPageParamsCodec>;

const generateErrorMessage = (errorType: O.Option<string>) => pipe(
  errorType,
  O.match(
    () => 'Something unexpected happened; the action may have not completed. Please go back and try again.',
    () => 'The list description cannot contain the following characters: &lt; &gt;. Please go back and try again.',
  ),
  toHtmlFragment,
);

export const actionFailedPage = (params: Params): ActionFailedPage => TE.left(
  toErrorPageViewModel({
    type: DE.unavailable,
    message: generateErrorMessage(params.errorType),
  }),
);
