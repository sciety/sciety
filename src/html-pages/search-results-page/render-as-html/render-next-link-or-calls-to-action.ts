import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderLegacyPaginationControls } from '../../../shared-components/pagination/index.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';

export const renderNextLinkOrCallsToAction = (pageNumber: number, basePath: O.Option<string>): HtmlFragment => pipe(
  basePath,
  O.fold(
    () => '<footer>Not what you were hoping for? Try our <a href="https://blog.sciety.org/sciety-search/">advanced search tips</a>, or <a href="/contact-us">leave us a suggestion</a>.</footer>',
    (base) => renderLegacyPaginationControls({
      nextPageHref: O.some(`${base}page=${pageNumber}`),
    }),
  ),
  toHtmlFragment,
);
