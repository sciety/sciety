import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderOurLists = (fragments: ReadonlyArray<string>): HtmlFragment => pipe(
  fragments.join(''),
  (slimlineCards) => `<h2>Our lists</h2><ul>${slimlineCards}</ul>`,
  toHtmlFragment,
);
