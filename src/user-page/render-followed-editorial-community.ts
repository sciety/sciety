import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

interface Community {
  id: EditorialCommunityId;
  name: string;
  avatar: URL;
}

export type RenderFollowedEditorialCommunity = (
  community: Community,
  userId: O.Option<UserId>,
) => T.Task<HtmlFragment>;

type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialcommunityid: EditorialCommunityId,
) => T.Task<HtmlFragment>;

const render = (community: Community) => (toggle: string): string => `
  <div class="label">
    <img src="${community.avatar.toString()}" alt="">
  </div>
  <div class="content">
    <div class="summary">
      <a href="/editorial-communities/${community.id.value}">${community.name}</a>
    </div>
  </div>
  <div class="right floated">
    ${toggle}
  </div>
`;

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderFollowedEditorialCommunity => (community, userId) => pipe(
  renderFollowToggle(userId, community.id),
  T.map(render(community)),
  T.map(toHtmlFragment),
);
