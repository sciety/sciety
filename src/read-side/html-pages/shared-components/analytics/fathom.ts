import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderFathomScript = (fathomId: string) => `
  <script src="https://cdn.usefathom.com/script.js" data-site="${fathomId}" defer data-cookieconsent="ignore"></script>
`;

export const fathom = (): HtmlFragment => pipe(
  process.env.FATHOM_SITE_ID,
  O.fromNullable,
  O.match(
    constant(''),
    renderFathomScript,
  ),
  toHtmlFragment,
);
