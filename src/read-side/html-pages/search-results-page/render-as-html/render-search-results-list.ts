import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderArticleList } from '../../shared-components/article-list';
import { renderListItems } from '../../shared-components/list-items';

export const renderSearchResultsList = (cards: ReadonlyArray<HtmlFragment>): O.Option<HtmlFragment> => pipe(
  cards,
  RNEA.fromReadonlyArray,
  O.map(
    (a) => renderArticleList(renderListItems(a)),
  ),
  O.map(toHtmlFragment),
);
