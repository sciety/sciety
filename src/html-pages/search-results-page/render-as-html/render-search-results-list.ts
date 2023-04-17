import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { templateListItems } from '../../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderSearchResultsList = (cards: ReadonlyArray<HtmlFragment>): O.Option<HtmlFragment> => pipe(
  cards,
  RNEA.fromReadonlyArray,
  O.map(
    (a) => `
      <ol class="card-list" role="list">
        ${templateListItems(a)}
      </ol>
    `,
  ),
  O.map(toHtmlFragment),
);
