import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderLegacyPaginationControls } from '../../shared-components/pagination';

export const renderNextLinkOrCallsToAction = (nextPageHref: O.Option<string>): HtmlFragment => pipe(
  nextPageHref,
  O.match(
    () => '<footer>Not what you were hoping for? Try our <a href="https://blog.sciety.org/sciety-search/">advanced search tips</a>, or <a href="/contact-us">leave us a suggestion</a>.</footer>',
    () => renderLegacyPaginationControls(
      { nextPageHref },
    ),
  ),
  toHtmlFragment,
);
