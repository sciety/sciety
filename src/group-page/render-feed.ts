import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow } from 'fp-ts/function';
import { FeedItem, renderSummaryFeedList } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const emptyFeed = `
  <p>
    It looks like this group hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

type RenderFeed = (events: ReadonlyArray<FeedItem>) => HtmlFragment;

export const renderFeed: RenderFeed = flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(emptyFeed),
    renderSummaryFeedList,
  ),
  toHtmlFragment,
);
