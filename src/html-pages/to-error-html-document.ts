import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { constructHtmlResponse } from './construct-html-response';
import { toHtmlFragment } from '../types/html-fragment';
import * as DE from '../types/data-error';
import { CompleteHtmlDocument } from './complete-html-document';
import { ClientClassification } from '../shared-components/head';

export const toErrorHtmlDocument = (
  errorMessage: string,
  clientClassification: ClientClassification,
): CompleteHtmlDocument => pipe(
  constructHtmlResponse(O.none, standardPageLayout, clientClassification)(E.left({
    message: toHtmlFragment(errorMessage),
    type: DE.unavailable,
  })).document,
);
