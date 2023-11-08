import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { constructHtmlResponse } from './construct-html-response';
import { toHtmlFragment } from '../types/html-fragment';
import * as DE from '../types/data-error';
import { CompleteHtmlDocument } from './complete-html-document';

export const toErrorHtmlDocument = (errorMessage: string): CompleteHtmlDocument => pipe(
  constructHtmlResponse(O.none, standardPageLayout)(E.left({
    message: toHtmlFragment(errorMessage),
    type: DE.unavailable,
  })).document,
);
