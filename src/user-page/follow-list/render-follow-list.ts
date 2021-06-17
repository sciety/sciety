import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow } from 'fp-ts/function';
import { templateListItems } from '../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const followingNothing = `
  <p class="followed-groups__no_groups">They’re not following anything. When they do, they’ll be listed here.</p>
`;

const followListSection = (list: string) => `
  <section class="followed-groups">
    <h2>
      Following
    </h2>
    ${list}
  </section>
`;

const renderList = (list: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => (`
  <ol class="followed-groups__list" role="list">
    ${templateListItems(list, 'followed-groups__item')}
  </ol>
`);

type RenderFollowList = (communities: ReadonlyArray<HtmlFragment>) => HtmlFragment;

export const renderFollowList: RenderFollowList = flow(
  RNEA.fromReadonlyArray,
  O.fold(constant(followingNothing), renderList),
  followListSection,
  toHtmlFragment,
);
