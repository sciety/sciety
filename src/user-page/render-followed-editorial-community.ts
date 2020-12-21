import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowedEditorialCommunity = (
  editorialCommunity: EditorialCommunity,
  userId: Maybe<UserId>,
) => T.Task<HtmlFragment>;

type RenderFollowToggle = (userId: Maybe<UserId>, editorialcommunityid: EditorialCommunityId) => Promise<HtmlFragment>;

interface EditorialCommunity {
  id: EditorialCommunityId;
  name: string;
  avatar: URL;
}

export default (
  renderFollowToggle: RenderFollowToggle,
): RenderFollowedEditorialCommunity => (
  (editorialCommunity, userId) => async () => toHtmlFragment(`
    <div class="label">
      <img src="${editorialCommunity.avatar.toString()}" alt="">
    </div>
    <div class="content">
      <div class="summary">
        <a href="/editorial-communities/${editorialCommunity.id.value}">${editorialCommunity.name}</a>
      </div>
    </div>
    <div class="right floated">
      ${await renderFollowToggle(userId, editorialCommunity.id)}
    </div>
  `)
);
