import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow } from 'fp-ts/function';
import { templateListItems } from '../../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const followingNothing = `
  <p class="followed-groups__no_groups">This user is currently not following any groups.</p>
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
  toHtmlFragment,
);
