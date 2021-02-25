import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow } from 'fp-ts/function';
import { templateListItems } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const followingNothing = `
  <p>They’re not following anything. When they do, they’ll be listed here.</p>
`;

const followListSection = (list: string) => `
  <section class="followed-communities">
    <h2>
      Following
    </h2>
    ${list}
  </section>
`;

const renderList = (list: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => (`
  <ol class="followed-communities__list" role="list">
    ${templateListItems(list, 'followed-communities__item')}
  </ol>
`);

type RenderFollowList = (communities: ReadonlyArray<HtmlFragment>) => HtmlFragment;

export const renderFollowList: RenderFollowList = flow(
  RNEA.fromReadonlyArray,
  O.fold(constant(followingNothing), renderList),
  followListSection,
  toHtmlFragment,
);
