import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { constant, flow, pipe } from 'fp-ts/function';
import { Group, RenderGroup } from './render-group';
import { templateListItems } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderGroups = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type GetAllGroups = T.Task<RNEA.ReadonlyNonEmptyArray<Group>>;

const render = (links: RNEA.ReadonlyNonEmptyArray<HtmlFragment>) => `
  <section>
    <h2>
      Groups
    </h2>
    <ol class="group-list" role="list">
      ${templateListItems(links, 'group-list__item')}
    </ol>
  </section>
`;

export const renderGroups = (
  editorialCommunities: GetAllGroups,
  renderGroup: RenderGroup,
): RenderGroups => (userId) => (
  pipe(
    editorialCommunities,
    T.chain(T.traverseArray(renderGroup(userId))),
    T.map(flow(
      RNEA.fromReadonlyArray, // TODO shouldn't be needed, fp-ts types needs fixing
      O.fold(constant(''), render),
      toHtmlFragment,
    )),
  )
);
