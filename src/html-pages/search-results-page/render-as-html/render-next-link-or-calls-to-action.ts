import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderPaginationControls } from '../../../shared-components/pagination';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderNextLinkOrCallsToAction = (pageNumber: number, basePath: O.Option<string>): HtmlFragment => pipe(
  basePath,
  O.fold(
    () => '<footer class="search-results__footer">Not what you were hoping for? Try our <a href="https://blog.sciety.org/sciety-search/">advanced search tips</a>, or <a href="/contact-us">leave us a suggestion</a>.</footer>',
    (base) => renderPaginationControls({
      nextPageHref: O.some(`${base}page=${pageNumber}`),
    }),
  ),
  toHtmlFragment,
);
