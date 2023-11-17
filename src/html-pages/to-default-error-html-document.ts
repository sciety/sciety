import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout.js';
import { constructHtmlResponse } from './construct-html-response.js';
import { toHtmlFragment } from '../types/html-fragment.js';
import * as DE from '../types/data-error.js';
import { CompleteHtmlDocument } from './complete-html-document.js';
import { ClientClassification } from '../shared-components/head.js';
import { UserDetails } from '../types/user-details.js';

export const toDefaultErrorHtmlDocument = (
  errorMessage: string,
  clientClassification: ClientClassification,
  userDetails: O.Option<UserDetails>,
): CompleteHtmlDocument => pipe(
  constructHtmlResponse(userDetails, standardPageLayout, clientClassification)(E.left({
    message: toHtmlFragment(errorMessage),
    type: DE.unavailable,
  })).document,
);
