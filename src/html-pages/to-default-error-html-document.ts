import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { constructHtmlResponse } from './construct-html-response';
import { toHtmlFragment } from '../types/html-fragment';
import * as DE from '../types/data-error';
import { CompleteHtmlDocument } from './complete-html-document';
import { ClientClassification } from '../shared-components/head';
import { UserDetails } from '../types/user-details';
import { toErrorPageBodyViewModel } from '../types/error-page-body-view-model';

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
