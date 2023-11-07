import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { constructHtmlResponse } from './construct-html-response';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import * as DE from '../types/data-error';

export const toErrorHtmlDocument = (errorMessage: string): HtmlFragment => pipe(
  constructHtmlResponse(O.none, standardPageLayout)(E.left({
    message: toHtmlFragment(errorMessage),
    type: DE.unavailable,
  })).document,
);
