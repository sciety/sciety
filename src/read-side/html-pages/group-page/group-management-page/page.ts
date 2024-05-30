import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html';
import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { ConstructLoggedInPage } from '../../construct-page';

const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => pipe(
  e,
  DE.match({
    notFound: () => 'No such group. Please check and try again.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
    notAuthorised: () => 'You aren\'t permitted to do that.',
  }),
  toHtmlFragment,
  (message) => toErrorPageBodyViewModel({
    type: e,
    message,
  }),
);

export const page = (
  dependencies: Dependencies,
): ConstructLoggedInPage => (userId, input) => pipe(
  input,
  paramsCodec.decode,
  E.mapLeft((errors) => {
    dependencies.logger('warn', 'group-add-a-featured-list-form-page params codec failed', { errors: formatValidationErrors(errors) });
    return DE.notFound;
  }),
  E.chainW(constructViewModel(dependencies, userId)),
  E.bimap(renderErrorPage, renderAsHtml),
  TE.fromEither,
);
