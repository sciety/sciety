import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { constructHtmlResponse } from './construct-html-response';
import { standardPageLayout } from './shared-components/standard-page-layout';
import { ClientClassification } from '../../shared-components/head';
import * as DE from '../../types/data-error';
import { toErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserDetails } from '../../types/user-details';

export const toDefaultErrorHtmlDocument = (
  errorMessage: string,
  clientClassification: ClientClassification,
  userDetails: O.Option<UserDetails>,
): CompleteHtmlDocument => pipe(
  constructHtmlResponse(userDetails, standardPageLayout, clientClassification)(E.left(toErrorPageBodyViewModel({
    message: toHtmlFragment(errorMessage),
    type: DE.unavailable,
  }))).document,
);