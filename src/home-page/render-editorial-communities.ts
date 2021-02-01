import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { RenderEditorialCommunity } from './render-editorial-community';
import { templateListItems } from '../shared-components/list-items';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderEditorialCommunities = (userId: O.Option<UserId>) => T.Task<HtmlFragment>;

export type GetAllEditorialCommunities = T.Task<Array<{
  avatar: URL,
  id: EditorialCommunityId,
  name: string,
}>>;

const render = (links: ReadonlyArray<HtmlFragment>): string => `
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
    T.map(render),
    T.map(toHtmlFragment),
  )
);
