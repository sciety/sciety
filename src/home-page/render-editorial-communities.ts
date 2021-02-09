import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { constant, pipe } from 'fp-ts/function';
import { Community, RenderEditorialCommunity } from './render-editorial-community';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

// TODO Make a ReadonlyNonEmptyArray
export type GetAllEditorialCommunities = T.Task<ReadonlyArray<Community>>;

const render = (links: RNEA.ReadonlyNonEmptyArray<HtmlFragment>): string => `
  <section>
    <h2>
      Editorial communities
    </h2>
    <ol class="editorial-community-list" role="list">
      ${templateListItems(links, 'editorial-community-list__item')}
    </ol>
  </section>
`;

export const createRenderEditorialCommunities = (
  editorialCommunities: GetAllEditorialCommunities,
  renderEditorialCommunity: RenderEditorialCommunity,
): RenderEditorialCommunities => (userId) => (
  pipe(
    editorialCommunities,
    T.chain(T.traverseArray(renderEditorialCommunity(userId))),
    T.map(RNEA.fromReadonlyArray),
    T.map(O.fold(constant(''), render)),
    T.map(toHtmlFragment),
  )
);
